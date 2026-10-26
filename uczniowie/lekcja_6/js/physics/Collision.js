/**
 * Collision.js
 *
 * Collision detection system for player-world interaction.
 * Checks player AABB against voxel world for solid blocks.
 * Implements ground detection, wall sliding, and movement validation.
 * Prevents player from moving through solid blocks.
 */

/**
 * Collision - Basic collision detection for Phase 2
 * Tasks 2.3.1
 */
class Collision {
    /**
     * Constructor
     * @param {VoxelWorld} world - Reference to VoxelWorld instance
     */
    constructor(world) {
        this.world = world;
        console.log('Collision system initialized');
    }

    /**
     * Check if player is on the ground
     * Task 2.3.1
     * @param {THREE.Vector3} position - Player position (camera position)
     * @returns {boolean} True if player is grounded
     */
    isGrounded(position) {
        // Check voxel just below player's feet
        // Camera is at eye height (1.6 blocks above feet)
        // We need to check the block BELOW the feet (subtract 1.6 to get feet, then subtract another 0.1 to check below)
        const checkY = Math.floor(position.y - 1.6 - 0.1); // Check block below feet
        const checkX = Math.floor(position.x);
        const checkZ = Math.floor(position.z);

        // Get voxel value
        const voxel = this.world.getVoxel(checkX, checkY, checkZ);

        // Grounded if voxel is solid (non-zero)
        return voxel !== 0;
    }

    /**
     * Get the ground level at a given XZ position
     * @param {number} x - World X coordinate
     * @param {number} z - World Z coordinate
     * @returns {number} Y coordinate of ground surface (or -Infinity if no ground)
     */
    getGroundLevel(x, z) {
        const checkX = Math.floor(x);
        const checkZ = Math.floor(z);

        // Search downward from a reasonable height
        for (let y = 50; y >= -10; y--) {
            const voxel = this.world.getVoxel(checkX, y, checkZ);
            if (voxel !== 0) {
                // Found solid block, ground is on top of it
                return y + 1;
            }
        }

        return -Infinity; // No ground found
    }

    /**
     * Check collision and adjust velocity to prevent walking through blocks
     * Task 3.4.1 - Enhanced collision detection with wall sliding
     * @param {THREE.Vector3} position - Player position (camera position)
     * @param {object} velocity - Velocity vector {x, y, z}
     * @param {number} deltaTime - Time delta in seconds
     * @returns {object} Adjusted velocity that prevents penetration
     */
    checkCollision(position, velocity, deltaTime) {
        // Player AABB dimensions
        // Width: 0.8 (0.4 on each side), Height: 1.8 (1.6 below camera, 0.2 above)
        const width = 0.4; // Half-width
        const height = 1.8;
        const eyeHeight = 1.6; // Camera is 1.6 units above feet

        // Calculate next position
        const nextX = position.x + velocity.x * deltaTime;
        const nextY = position.y + velocity.y * deltaTime;
        const nextZ = position.z + velocity.z * deltaTime;

        // Adjusted velocity (may be modified if collision detected)
        const adjusted = { x: velocity.x, y: velocity.y, z: velocity.z };

        // Check X axis collision
        const minX = Math.floor(nextX - width);
        const maxX = Math.floor(nextX + width);
        const minY = Math.floor(position.y - eyeHeight);
        const maxY = Math.floor(position.y + (height - eyeHeight));
        const minZ = Math.floor(position.z - width);
        const maxZ = Math.floor(position.z + width);

        // Check X movement
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                if (velocity.x > 0) {
                    // Moving right, check right side
                    const voxel = this.world.getVoxel(maxX, y, z);
                    if (voxel !== 0) {
                        adjusted.x = 0; // Stop X movement
                    }
                } else if (velocity.x < 0) {
                    // Moving left, check left side
                    const voxel = this.world.getVoxel(minX, y, z);
                    if (voxel !== 0) {
                        adjusted.x = 0; // Stop X movement
                    }
                }
            }
        }

        // Check Z axis collision
        const minZNext = Math.floor(nextZ - width);
        const maxZNext = Math.floor(nextZ + width);
        const minXCurrent = Math.floor(position.x - width);
        const maxXCurrent = Math.floor(position.x + width);

        for (let y = minY; y <= maxY; y++) {
            for (let x = minXCurrent; x <= maxXCurrent; x++) {
                if (velocity.z > 0) {
                    // Moving forward, check front side
                    const voxel = this.world.getVoxel(x, y, maxZNext);
                    if (voxel !== 0) {
                        adjusted.z = 0; // Stop Z movement
                    }
                } else if (velocity.z < 0) {
                    // Moving backward, check back side
                    const voxel = this.world.getVoxel(x, y, minZNext);
                    if (voxel !== 0) {
                        adjusted.z = 0; // Stop Z movement
                    }
                }
            }
        }

        // Check Y axis collision (ceiling and floor)
        if (velocity.y !== 0) {
            const minXY = Math.floor(position.x - width);
            const maxXY = Math.floor(position.x + width);
            const minZY = Math.floor(position.z - width);
            const maxZY = Math.floor(position.z + width);

            if (velocity.y < 0) {
                // Falling - check floor
                const checkY = Math.floor(nextY - eyeHeight);
                for (let x = minXY; x <= maxXY; x++) {
                    for (let z = minZY; z <= maxZY; z++) {
                        const voxel = this.world.getVoxel(x, checkY, z);
                        if (voxel !== 0) {
                            adjusted.y = 0; // Stop falling
                        }
                    }
                }
            } else if (velocity.y > 0) {
                // Jumping - check ceiling
                const checkY = Math.floor(nextY + (height - eyeHeight));
                for (let x = minXY; x <= maxXY; x++) {
                    for (let z = minZY; z <= maxZY; z++) {
                        const voxel = this.world.getVoxel(x, checkY, z);
                        if (voxel !== 0) {
                            adjusted.y = 0; // Stop jumping
                        }
                    }
                }
            }
        }

        return adjusted;
    }

    /**
     * Check if a position would intersect with any voxels
     * Used for block placement validation (Task 3.3.3)
     * @param {object} position - Position {x, y, z}
     * @param {number} width - Half-width of AABB
     * @param {number} height - Height of AABB
     * @returns {boolean} True if position intersects with solid voxels
     */
    checkAABBCollision(position, width = 0.4, height = 1.8) {
        const eyeHeight = 1.6;

        const minX = Math.floor(position.x - width);
        const maxX = Math.floor(position.x + width);
        const minY = Math.floor(position.y - eyeHeight);
        const maxY = Math.floor(position.y + (height - eyeHeight));
        const minZ = Math.floor(position.z - width);
        const maxZ = Math.floor(position.z + width);

        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                for (let x = minX; x <= maxX; x++) {
                    const voxel = this.world.getVoxel(x, y, z);
                    if (voxel !== 0) {
                        return true; // Collision detected
                    }
                }
            }
        }

        return false; // No collision
    }
}

// Make Collision globally available (required for script tag approach)
window.Collision = Collision;
