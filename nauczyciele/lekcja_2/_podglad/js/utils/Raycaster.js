/**
 * Raycaster.js
 *
 * Voxel raycasting for block selection and placement.
 * Casts ray from camera to find intersected voxels.
 * Determines hit position, face normal, and distance.
 * Used for block highlighting, destruction, and placement.
 */

/**
 * Raycaster - Voxel raycasting for block selection
 * Tasks 3.1.1, 3.1.2, 3.1.3
 */
class Raycaster {
    /**
     * Constructor
     * Task 3.1.1
     * @param {VoxelWorld} world - Reference to VoxelWorld instance
     * @param {THREE.Camera} camera - Reference to camera
     */
    constructor(world, camera) {
        this.world = world;
        this.camera = camera;
        console.log('Raycaster initialized');
    }

    /**
     * Cast ray from camera to find voxel intersection
     * Task 3.1.2, 3.1.3 - DDA voxel traversal algorithm
     * @param {number} maxDistance - Maximum ray distance
     * @returns {object|null} Hit result {position: [x,y,z], normal: [nx,ny,nz], distance, voxelType} or null
     */
    cast(maxDistance = 10) {
        // Get camera position
        const origin = this.camera.position;

        // Get camera direction (forward vector)
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);

        // DDA algorithm - step through voxel grid
        // Start position
        let x = Math.floor(origin.x);
        let y = Math.floor(origin.y);
        let z = Math.floor(origin.z);

        // Step direction (1 or -1)
        const stepX = Math.sign(direction.x);
        const stepY = Math.sign(direction.y);
        const stepZ = Math.sign(direction.z);

        // Distance to next voxel boundary along each axis
        const tDeltaX = stepX !== 0 ? Math.abs(1 / direction.x) : Infinity;
        const tDeltaY = stepY !== 0 ? Math.abs(1 / direction.y) : Infinity;
        const tDeltaZ = stepZ !== 0 ? Math.abs(1 / direction.z) : Infinity;

        // Initial t values to reach next voxel boundary
        let tMaxX, tMaxY, tMaxZ;

        // Calculate initial tMax values
        if (stepX > 0) {
            tMaxX = ((x + 1) - origin.x) / direction.x;
        } else if (stepX < 0) {
            tMaxX = (x - origin.x) / direction.x;
        } else {
            tMaxX = Infinity;
        }

        if (stepY > 0) {
            tMaxY = ((y + 1) - origin.y) / direction.y;
        } else if (stepY < 0) {
            tMaxY = (y - origin.y) / direction.y;
        } else {
            tMaxY = Infinity;
        }

        if (stepZ > 0) {
            tMaxZ = ((z + 1) - origin.z) / direction.z;
        } else if (stepZ < 0) {
            tMaxZ = (z - origin.z) / direction.z;
        } else {
            tMaxZ = Infinity;
        }

        // Track which face was hit (for determining normal)
        let hitNormal = [0, 0, 0];

        // Step through grid
        let distance = 0;
        const maxSteps = Math.ceil(maxDistance * 2); // Safety limit

        for (let i = 0; i < maxSteps; i++) {
            // Check if current voxel is solid
            const voxel = this.world.getVoxel(x, y, z);

            if (voxel !== 0) {
                // Hit a solid block!
                // Task 3.1.3 - Return hit info with face normal
                return {
                    position: [x, y, z],
                    normal: hitNormal,
                    distance: distance,
                    voxelType: voxel
                };
            }

            // Move to next voxel boundary (closest one)
            if (tMaxX < tMaxY) {
                if (tMaxX < tMaxZ) {
                    // Step in X direction
                    x += stepX;
                    distance = tMaxX;
                    tMaxX += tDeltaX;
                    hitNormal = [-stepX, 0, 0]; // Normal points back
                } else {
                    // Step in Z direction
                    z += stepZ;
                    distance = tMaxZ;
                    tMaxZ += tDeltaZ;
                    hitNormal = [0, 0, -stepZ];
                }
            } else {
                if (tMaxY < tMaxZ) {
                    // Step in Y direction
                    y += stepY;
                    distance = tMaxY;
                    tMaxY += tDeltaY;
                    hitNormal = [0, -stepY, 0];
                } else {
                    // Step in Z direction
                    z += stepZ;
                    distance = tMaxZ;
                    tMaxZ += tDeltaZ;
                    hitNormal = [0, 0, -stepZ];
                }
            }

            // Stop if we've gone too far
            if (distance > maxDistance) {
                break;
            }
        }

        // No hit
        return null;
    }
}

// Make Raycaster globally available (required for script tag approach)
window.Raycaster = Raycaster;
