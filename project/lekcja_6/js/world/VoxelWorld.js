/**
 * VoxelWorld.js
 *
 * Core voxel storage and management system.
 * Authoritative source for all voxel data in the world.
 * Handles chunk-based storage, coordinate translation, and voxel state access.
 * Provides the primary API for reading and writing voxel data.
 */

/**
 * VoxelWorld - Manages voxel data using chunk-based storage
 * Tasks 2.1.1 - 2.1.5
 */
class VoxelWorld {
    /**
     * Constructor
     * @param {number} cellSize - Size of each chunk (default 32)
     * Task 2.1.1
     */
    constructor(cellSize = 32) {
        this.cellSize = cellSize;
        this.cells = {}; // Dictionary for chunk storage: "x,y,z" -> Uint8Array

        console.log(`VoxelWorld initialized with cellSize: ${cellSize}`);
    }

    /**
     * Compute chunk ID from world coordinates
     * Task 2.1.2
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @param {number} z - World Z coordinate
     * @returns {string} Chunk ID as "x,y,z"
     */
    computeCellId(x, y, z) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        const cellZ = Math.floor(z / this.cellSize);
        return `${cellX},${cellY},${cellZ}`;
    }

    /**
     * Convert world coordinates to local chunk coordinates
     * Task 2.1.2
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @param {number} z - World Z coordinate
     * @returns {object} Local coordinates {x, y, z}
     */
    worldToLocal(x, y, z) {
        return {
            x: ((x % this.cellSize) + this.cellSize) % this.cellSize,
            y: ((y % this.cellSize) + this.cellSize) % this.cellSize,
            z: ((z % this.cellSize) + this.cellSize) % this.cellSize
        };
    }

    /**
     * Compute voxel offset in Uint8Array from local coordinates
     * Task 2.1.2
     * @param {number} x - Local X coordinate (0 to cellSize-1)
     * @param {number} y - Local Y coordinate (0 to cellSize-1)
     * @param {number} z - Local Z coordinate (0 to cellSize-1)
     * @returns {number} Index in Uint8Array
     */
    computeVoxelOffset(x, y, z) {
        const { cellSize } = this;
        return y * cellSize * cellSize + z * cellSize + x;
    }

    /**
     * Set voxel value at world coordinates
     * Task 2.1.3
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @param {number} z - World Z coordinate
     * @param {number} v - Voxel value (0 = air, 1+ = block types)
     */
    setVoxel(x, y, z, v) {
        const cellId = this.computeCellId(x, y, z);
        let cell = this.cells[cellId];

        // Create chunk if it doesn't exist
        if (!cell) {
            const cellVolume = this.cellSize * this.cellSize * this.cellSize;
            cell = new Uint8Array(cellVolume);
            this.cells[cellId] = cell;
        }

        // Convert to local coordinates and set value
        const local = this.worldToLocal(x, y, z);
        const offset = this.computeVoxelOffset(local.x, local.y, local.z);
        cell[offset] = v;
    }

    /**
     * Get voxel value at world coordinates
     * Task 2.1.3
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @param {number} z - World Z coordinate
     * @returns {number} Voxel value (0 if empty/out of bounds)
     */
    getVoxel(x, y, z) {
        const cellId = this.computeCellId(x, y, z);
        const cell = this.cells[cellId];

        // Return 0 if chunk doesn't exist
        if (!cell) {
            return 0;
        }

        // Convert to local coordinates and get value
        const local = this.worldToLocal(x, y, z);
        const offset = this.computeVoxelOffset(local.x, local.y, local.z);
        return cell[offset];
    }

    /**
     * Check if chunk exists at chunk coordinates
     * Task 2.1.4
     * @param {number} chunkX - Chunk X coordinate
     * @param {number} chunkY - Chunk Y coordinate
     * @param {number} chunkZ - Chunk Z coordinate
     * @returns {boolean} True if chunk exists
     */
    hasChunk(chunkX, chunkY, chunkZ) {
        const cellId = `${chunkX},${chunkY},${chunkZ}`;
        return this.cells[cellId] !== undefined;
    }

    /**
     * Get chunk bounds in world coordinates
     * Task 2.1.4
     * @param {number} chunkX - Chunk X coordinate
     * @param {number} chunkY - Chunk Y coordinate
     * @param {number} chunkZ - Chunk Z coordinate
     * @returns {object} Bounds {minX, minY, minZ, maxX, maxY, maxZ}
     */
    getChunkBounds(chunkX, chunkY, chunkZ) {
        return {
            minX: chunkX * this.cellSize,
            minY: chunkY * this.cellSize,
            minZ: chunkZ * this.cellSize,
            maxX: (chunkX + 1) * this.cellSize,
            maxY: (chunkY + 1) * this.cellSize,
            maxZ: (chunkZ + 1) * this.cellSize
        };
    }

    /**
     * Generate test terrain data
     * Task 2.1.5
     * Creates flat terrain at y=0 to y=10 for chunk (0, 0, 0)
     */
    generateTestTerrain() {
        console.log('Generating test terrain...');

        // Fill chunk (0, 0, 0) with flat terrain
        // x: 0..31, z: 0..31, y: 0..10
        for (let x = 0; x < 32; x++) {
            for (let z = 0; z < 32; z++) {
                for (let y = 0; y <= 10; y++) {
                    this.setVoxel(x, y, z, 1); // Block type 1 (grass)
                }
            }
        }

        console.log('Test terrain generated: 32x32 flat surface at y=0-10');
    }
}

// Make VoxelWorld globally available (required for script tag approach)
window.VoxelWorld = VoxelWorld;
