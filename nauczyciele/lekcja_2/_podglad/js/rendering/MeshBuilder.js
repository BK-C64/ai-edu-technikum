/**
 * MeshBuilder.js
 *
 * Converts voxel data into optimized Three.js BufferGeometry.
 * Implements face culling to render only visible faces.
 * Generates vertices, normals, UVs, and indices for chunk meshes.
 * Optimizes geometry for GPU rendering performance.
 */

/**
 * MeshBuilder - Generates optimized chunk geometry with face culling
 * Tasks 2.2.1 - 2.2.4
 */
class MeshBuilder {
    /**
     * Constructor
     * Task 2.2.1
     * @param {VoxelWorld} world - Reference to VoxelWorld instance
     */
    constructor(world) {
        this.world = world;

        // Define face data for all 6 directions
        // Each face has: direction vector, corner vertices, and normal
        // Task 2.2.1
        this.faces = [
            {
                // +X (right) - Looking from outside (+X direction)
                // CCW order: bottom-left, bottom-right, top-right, top-left
                dir: [1, 0, 0],
                corners: [
                    [1, 0, 1],  // bottom-left (from outside view)
                    [1, 0, 0],  // bottom-right
                    [1, 1, 0],  // top-right
                    [1, 1, 1]   // top-left
                ],
                normal: [1, 0, 0]
            },
            {
                // -X (left) - Looking from outside (-X direction)
                // CCW order: bottom-left, bottom-right, top-right, top-left
                dir: [-1, 0, 0],
                corners: [
                    [0, 0, 0],  // bottom-left (from outside view)
                    [0, 0, 1],  // bottom-right
                    [0, 1, 1],  // top-right
                    [0, 1, 0]   // top-left
                ],
                normal: [-1, 0, 0]
            },
            {
                // +Y (top) - Looking from outside (+Y direction)
                // CCW order: bottom-left, bottom-right, top-right, top-left
                dir: [0, 1, 0],
                corners: [
                    [0, 1, 0],  // bottom-left (from outside view)
                    [1, 1, 0],  // bottom-right
                    [1, 1, 1],  // top-right
                    [0, 1, 1]   // top-left
                ],
                normal: [0, 1, 0]
            },
            {
                // -Y (bottom) - Looking from outside (-Y direction)
                // CCW order: bottom-left, bottom-right, top-right, top-left
                dir: [0, -1, 0],
                corners: [
                    [0, 0, 1],  // bottom-left (from outside view)
                    [1, 0, 1],  // bottom-right
                    [1, 0, 0],  // top-right
                    [0, 0, 0]   // top-left
                ],
                normal: [0, -1, 0]
            },
            {
                // +Z (front) - Looking from outside (+Z direction)
                // CCW order: bottom-left, bottom-right, top-right, top-left
                dir: [0, 0, 1],
                corners: [
                    [0, 0, 1],  // bottom-left (from outside view)
                    [1, 0, 1],  // bottom-right
                    [1, 1, 1],  // top-right
                    [0, 1, 1]   // top-left
                ],
                normal: [0, 0, 1]
            },
            {
                // -Z (back) - Looking from outside (-Z direction)
                // CCW order: bottom-left, bottom-right, top-right, top-left
                dir: [0, 0, -1],
                corners: [
                    [1, 0, 0],  // bottom-left (from outside view)
                    [0, 0, 0],  // bottom-right
                    [0, 1, 0],  // top-right
                    [1, 1, 0]   // top-left
                ],
                normal: [0, 0, -1]
            }
        ];

        console.log('MeshBuilder initialized with corrected CCW face winding for proper culling');
    }

    /**
     * Build optimized chunk geometry with face culling
     * Tasks 2.2.2, 2.2.3, 2.2.4, 4.3.1 (vertex colors)
     * @param {number} cellX - Chunk X coordinate
     * @param {number} cellY - Chunk Y coordinate
     * @param {number} cellZ - Chunk Z coordinate
     * @param {TextureManager} textureManager - Optional texture manager for colors
     * @returns {THREE.BufferGeometry|null} Optimized geometry or null if no faces
     */
    buildChunkGeometry(cellX, cellY, cellZ, textureManager = null) {
        const { world } = this;
        const { cellSize } = world;

        // Arrays for geometry data (Task 2.2.3)
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        // Get chunk bounds in world coordinates
        const bounds = world.getChunkBounds(cellX, cellY, cellZ);
        const startX = bounds.minX;
        const startY = bounds.minY;
        const startZ = bounds.minZ;

        let vertexCount = 0;
        let faceCount = 0;

        // Iterate through all voxels in the chunk
        // Task 2.2.2 - Face culling logic
        for (let y = 0; y < cellSize; y++) {
            for (let z = 0; z < cellSize; z++) {
                for (let x = 0; x < cellSize; x++) {
                    // World coordinates
                    const worldX = startX + x;
                    const worldY = startY + y;
                    const worldZ = startZ + z;

                    // Get voxel value
                    const voxel = world.getVoxel(worldX, worldY, worldZ);

                    // Skip if air (0)
                    if (voxel === 0) {
                        continue;
                    }

                    // Check all 6 faces
                    for (const face of this.faces) {
                        const [dx, dy, dz] = face.dir;

                        // Get neighbor voxel in this direction
                        const neighborX = worldX + dx;
                        const neighborY = worldY + dy;
                        const neighborZ = worldZ + dz;
                        const neighbor = world.getVoxel(neighborX, neighborY, neighborZ);

                        // Only render face if neighbor is air (face culling)
                        if (neighbor === 0) {
                            // Add this face to geometry (Task 2.2.3)
                            faceCount++;

                            // Determine face direction for texture selection
                            let faceDirection;
                            if (face.normal[1] === 1) faceDirection = 'top';
                            else if (face.normal[1] === -1) faceDirection = 'bottom';
                            else faceDirection = 'side';

                            // Add 4 vertices for this quad
                            for (let cornerIndex = 0; cornerIndex < face.corners.length; cornerIndex++) {
                                const corner = face.corners[cornerIndex];

                                // Vertex position
                                positions.push(
                                    worldX + corner[0],
                                    worldY + corner[1],
                                    worldZ + corner[2]
                                );

                                // Normal (same for all 4 vertices)
                                normals.push(
                                    face.normal[0],
                                    face.normal[1],
                                    face.normal[2]
                                );

                                // UV coordinates from texture atlas
                                if (textureManager && textureManager.getUVForFace) {
                                    const [u, v] = textureManager.getUVForFace(voxel, faceDirection, cornerIndex);
                                    uvs.push(u, v);
                                } else {
                                    // Fallback UV coordinates
                                    const u = corner[0] || corner[2];
                                    const v = corner[1];
                                    uvs.push(u, v);
                                }
                            }

                            // Add indices for 2 triangles (makes a quad)
                            // Triangle 1: 0, 1, 2
                            // Triangle 2: 0, 2, 3
                            indices.push(
                                vertexCount,
                                vertexCount + 1,
                                vertexCount + 2,
                                vertexCount,
                                vertexCount + 2,
                                vertexCount + 3
                            );

                            vertexCount += 4;
                        }
                    }
                }
            }
        }

        // If no faces to render, return null
        if (faceCount === 0) {
            console.log(`Chunk (${cellX},${cellY},${cellZ}): No visible faces`);
            return null;
        }

        // Create BufferGeometry (Task 2.2.4)
        const geometry = new THREE.BufferGeometry();

        // Set attributes
        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );
        geometry.setAttribute(
            'normal',
            new THREE.Float32BufferAttribute(normals, 3)
        );
        geometry.setAttribute(
            'uv',
            new THREE.Float32BufferAttribute(uvs, 2)
        );

        // Set indices
        geometry.setIndex(indices);

        // Compute bounding sphere for frustum culling
        geometry.computeBoundingSphere();

        console.log(`Chunk (${cellX},${cellY},${cellZ}): Generated ${faceCount} faces (${vertexCount} vertices, ${indices.length} indices)`);

        return geometry;
    }
}

// Make MeshBuilder globally available (required for script tag approach)
window.MeshBuilder = MeshBuilder;
