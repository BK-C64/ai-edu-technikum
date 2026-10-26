/**
 * TerrainGenerator.js
 *
 * Procedural terrain generation system using noise algorithms.
 * Generates voxel data for new chunks deterministically.
 * Implements height map generation and layer-based block placement.
 * Supports biome-based generation strategies.
 */

/**
 * Simple Perlin-like noise implementation for terrain generation
 * Based on improved noise by Ken Perlin (2002)
 * Task 4.4.1
 */
class SimplexNoise {
    constructor(seed = 0) {
        this.seed = seed;
        // Generate permutation table based on seed
        this.p = this.generatePermutation(seed);
    }

    /**
     * Generate permutation table from seed
     * @param {number} seed - Random seed
     * @returns {Array} Permutation table
     */
    generatePermutation(seed) {
        const p = [];
        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }

        // Shuffle using seeded random
        let random = seed;
        for (let i = 255; i > 0; i--) {
            // Simple seeded random number generator
            random = (random * 9301 + 49297) % 233280;
            const randomValue = random / 233280;
            const j = Math.floor(randomValue * (i + 1));

            // Swap
            const temp = p[i];
            p[i] = p[j];
            p[j] = temp;
        }

        // Duplicate permutation table
        return [...p, ...p];
    }

    /**
     * Fade function for smooth interpolation
     * @param {number} t - Input value
     * @returns {number} Smoothed value
     */
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    /**
     * Linear interpolation
     * @param {number} t - Interpolation factor [0, 1]
     * @param {number} a - Start value
     * @param {number} b - End value
     * @returns {number} Interpolated value
     */
    lerp(t, a, b) {
        return a + t * (b - a);
    }

    /**
     * Gradient function
     * @param {number} hash - Hash value
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {number} Gradient value
     */
    grad(hash, x, y) {
        const h = hash & 3;
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    /**
     * 2D Perlin noise function
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {number} Noise value in range [-1, 1]
     */
    noise2D(x, y) {
        // Find unit grid cell containing point
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        // Get relative xy coordinates of point within cell
        x -= Math.floor(x);
        y -= Math.floor(y);

        // Compute fade curves for x and y
        const u = this.fade(x);
        const v = this.fade(y);

        // Hash coordinates of the 4 cube corners
        const a = this.p[X] + Y;
        const aa = this.p[a];
        const ab = this.p[a + 1];
        const b = this.p[X + 1] + Y;
        const ba = this.p[b];
        const bb = this.p[b + 1];

        // Blend results from 4 corners
        const gradAA = this.grad(this.p[aa], x, y);
        const gradBA = this.grad(this.p[ba], x - 1, y);
        const gradAB = this.grad(this.p[ab], x, y - 1);
        const gradBB = this.grad(this.p[bb], x - 1, y - 1);

        const lerpX1 = this.lerp(u, gradAA, gradBA);
        const lerpX2 = this.lerp(u, gradAB, gradBB);

        return this.lerp(v, lerpX1, lerpX2);
    }

    /**
     * Fractal Brownian Motion (multiple octaves of noise)
     * Task 4.4.2
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} octaves - Number of noise layers
     * @param {number} persistence - Amplitude multiplier per octave
     * @returns {number} Noise value in range [0, 1]
     */
    fbm(x, y, octaves = 4, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise2D(x * frequency, y * frequency) * amplitude;

            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        // Normalize to [0, 1]
        return (total / maxValue + 1) * 0.5;
    }
}

/**
 * TerrainGenerator - Generates procedural terrain for chunks
 * Tasks 4.4.1 - 4.4.4
 */
class TerrainGenerator {
    /**
     * Constructor
     * @param {number} seed - Random seed for deterministic generation
     */
    constructor(seed = 12345) {
        this.seed = seed;
        this.noise = new SimplexNoise(seed);

        // Terrain generation parameters
        this.seaLevel = 8;           // Y level for water
        this.minHeight = 0;          // Minimum terrain height
        this.maxHeight = 24;         // Maximum terrain height
        this.heightScale = 0.03;     // Noise frequency (lower = smoother terrain)
        this.heightAmplitude = 16;   // Height variation range

        console.log(`TerrainGenerator initialized with seed: ${seed}`);
    }

    /**
     * Get terrain height at world XZ coordinates
     * Task 4.4.2 - Height map generation
     * @param {number} worldX - World X coordinate
     * @param {number} worldZ - World Z coordinate
     * @returns {number} Terrain height (Y coordinate)
     */
    getTerrainHeight(worldX, worldZ) {
        // Use fractal Brownian motion for natural-looking terrain
        // Scale coordinates for appropriate frequency
        const x = worldX * this.heightScale;
        const z = worldZ * this.heightScale;

        // Get noise value [0, 1]
        const noiseValue = this.noise.fbm(x, z, 4, 0.5);

        // Map to terrain height range
        const height = this.seaLevel + (noiseValue - 0.5) * this.heightAmplitude;

        // Clamp to valid range
        return Math.floor(Math.max(this.minHeight, Math.min(this.maxHeight, height)));
    }

    /**
     * Generate voxel data for a chunk
     * Task 4.4.3 - Layer-based generation
     * @param {number} chunkX - Chunk X coordinate
     * @param {number} chunkY - Chunk Y coordinate
     * @param {number} chunkZ - Chunk Z coordinate
     * @param {number} cellSize - Chunk size (default 32)
     * @returns {Uint8Array} Voxel data for chunk
     */
    generateChunkData(chunkX, chunkY, chunkZ, cellSize = 32) {
        const voxels = new Uint8Array(cellSize * cellSize * cellSize);

        // Calculate world coordinates for chunk
        const baseX = chunkX * cellSize;
        const baseY = chunkY * cellSize;
        const baseZ = chunkZ * cellSize;

        // Generate voxels
        for (let localY = 0; localY < cellSize; localY++) {
            for (let localZ = 0; localZ < cellSize; localZ++) {
                for (let localX = 0; localX < cellSize; localX++) {
                    const worldX = baseX + localX;
                    const worldY = baseY + localY;
                    const worldZ = baseZ + localZ;

                    // Get terrain height at this XZ position
                    const terrainHeight = this.getTerrainHeight(worldX, worldZ);

                    // Determine block type based on depth from surface
                    let blockType = 0; // Air by default

                    if (worldY <= terrainHeight) {
                        const depthFromSurface = terrainHeight - worldY;

                        if (depthFromSurface === 0) {
                            // Surface layer
                            if (worldY > this.seaLevel + 2) {
                                blockType = 1; // Grass
                            } else if (worldY >= this.seaLevel - 2) {
                                blockType = 5; // Sand (near water)
                            } else {
                                blockType = 2; // Dirt (underwater)
                            }
                        } else if (depthFromSurface < 4) {
                            // Subsurface layers (1-3 blocks deep)
                            blockType = 2; // Dirt
                        } else {
                            // Deep layers
                            blockType = 3; // Stone
                        }

                        // Bedrock at bottom (y = 0)
                        if (worldY === 0) {
                            blockType = 10; // Bedrock (unbreakable)
                        }
                    }

                    // Calculate array index
                    const voxelOffset = localY * cellSize * cellSize + localZ * cellSize + localX;
                    voxels[voxelOffset] = blockType;
                }
            }
        }

        return voxels;
    }

    /**
     * Fill existing chunk with generated terrain data
     * Task 4.4.4 - Integration helper
     * @param {VoxelWorld} world - VoxelWorld instance
     * @param {number} chunkX - Chunk X coordinate
     * @param {number} chunkY - Chunk Y coordinate
     * @param {number} chunkZ - Chunk Z coordinate
     */
    fillChunk(world, chunkX, chunkY, chunkZ) {
        const cellSize = world.cellSize;
        const baseX = chunkX * cellSize;
        const baseY = chunkY * cellSize;
        const baseZ = chunkZ * cellSize;

        for (let localY = 0; localY < cellSize; localY++) {
            for (let localZ = 0; localZ < cellSize; localZ++) {
                for (let localX = 0; localX < cellSize; localX++) {
                    const worldX = baseX + localX;
                    const worldY = baseY + localY;
                    const worldZ = baseZ + localZ;

                    const terrainHeight = this.getTerrainHeight(worldX, worldZ);

                    let blockType = 0;

                    if (worldY <= terrainHeight) {
                        const depthFromSurface = terrainHeight - worldY;

                        if (depthFromSurface === 0) {
                            if (worldY > this.seaLevel + 2) {
                                blockType = 1; // Grass
                            } else if (worldY >= this.seaLevel - 2) {
                                blockType = 5; // Sand
                            } else {
                                blockType = 2; // Dirt
                            }
                        } else if (depthFromSurface < 4) {
                            blockType = 2; // Dirt
                        } else {
                            blockType = 3; // Stone
                        }

                        if (worldY === 0) {
                            blockType = 10; // Bedrock
                        }
                    }

                    world.setVoxel(worldX, worldY, worldZ, blockType);
                }
            }
        }

        console.log(`Generated terrain for chunk (${chunkX},${chunkY},${chunkZ})`);
    }
}

// Make TerrainGenerator globally available
window.TerrainGenerator = TerrainGenerator;
