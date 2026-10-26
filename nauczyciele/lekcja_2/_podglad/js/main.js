/**
 * main.js
 *
 * Main entry point for the Minecraft prototype game.
 * Initializes Three.js scene, camera, renderer, and coordinates all subsystems.
 * Contains the main game loop and orchestrates update/render cycles.
 */

// Verify Three.js loaded successfully (using global THREE object from CDN)
if (typeof THREE !== 'undefined') {
    console.log('Three.js loaded successfully! Version:', THREE.REVISION);
    console.log('Minecraft Prototype initialized');
} else {
    console.error('THREE is not defined! Check if Three.js CDN loaded correctly.');
}

// ===== PHASE 1: FOUNDATION - "Hello Cube" =====
// ===== PHASE 2: VOXEL WORLD - "Single Chunk" =====

// Global game state
let scene, camera, renderer;
let controls;
let inputHandler;
let lastTime = 0;

// Phase 2: Voxel world and physics
let voxelWorld;
let meshBuilder;
let collision;
let velocity = { x: 0, y: 0, z: 0 };

// Phase 3: Raycasting and block interaction
let raycaster;
let selectionBox; // Highlight mesh for selected block
let chunkMesh; // Store chunk mesh for regeneration

// Phase 4: Terrain generation and textures
let terrainGenerator;
let textureManager;
let chunkMeshes = {}; // Store all chunk meshes by key "x,y,z"

/**
 * Initialize Three.js scene, camera, and renderer
 * Task 1.1.1
 */
function initScene() {
    // Create scene
    scene = new THREE.Scene();

    // Set sky blue background
    scene.background = new THREE.Color(0x87CEEB);
    console.log('Sky background set to sky blue (0x87CEEB)');

    // Add atmospheric fog (VISUAL_IMPROVEMENTS_PLAN.md - Task 2.1.1)
    // Linear fog: color matches sky, near=32 (start fading), far=96 (fully fogged)
    scene.fog = new THREE.Fog(0x87CEEB, 32, 96);
    console.log('Atmospheric fog added: color=0x87CEEB, near=32, far=96');

    // Create perspective camera
    // FOV 75, aspect ratio based on window, near clip 0.1, far clip 1000
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // Position camera at (0, 5, 10) looking at scene center
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Create WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set output encoding for proper color management (check which property exists)
    if (THREE.sRGBEncoding !== undefined) {
        renderer.outputEncoding = THREE.sRGBEncoding;
        console.log('Using renderer.outputEncoding = sRGBEncoding');
    } else if (THREE.SRGBColorSpace !== undefined) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        console.log('Using renderer.outputColorSpace = SRGBColorSpace');
    }

    // Append renderer canvas to game container
    const container = document.getElementById('game-container');
    container.appendChild(renderer.domElement);

    console.log('Scene initialized: Camera at', camera.position);
}

/**
 * Add window resize handler
 * Task 1.1.2
 */
function initResizeHandler() {
    window.addEventListener('resize', () => {
        // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Update renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/**
 * Add lighting to the scene
 * Task 1.1.3
 */
function initLighting() {
    // Create ambient light (0xffffff, intensity 0.6)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Create directional light (0xffffff, intensity 0.8)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    console.log('Lighting initialized');
}

/**
 * Create test cube
 * Task 1.2.1
 * REPLACED IN PHASE 2 by createVoxelWorld()
 */
function createTestCube() {
    // Commented out - replaced by voxel world in Phase 2
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // cube.position.set(0, 0, 0);
    // scene.add(cube);

    console.log('Test cube disabled - using voxel world instead');
}

/**
 * Create voxel world and render chunks
 * Tasks 2.2.5 (Phase 2), 4.4.4, 4.5.1 (Phase 4)
 * Updated with texture atlas support
 */
async function createVoxelWorld() {
    console.log('=== VISUAL IMPROVEMENTS: Creating Voxel World with Procedural Textures ===');

    // Create VoxelWorld instance (Task 2.1.1)
    voxelWorld = new VoxelWorld(32); // 32x32x32 chunks

    // Create TerrainGenerator (Task 4.4.1)
    terrainGenerator = new TerrainGenerator(12345); // Fixed seed for reproducibility

    // Create TextureManager (Task 4.2.1)
    textureManager = new TextureManager();

    // Load texture atlas
    console.log('Loading procedural texture atlas...');
    await textureManager.loadAtlas();

    // Debug: Append canvas to DOM to visually verify colors
    if (window.DEBUG_TEXTURES) {
        const atlas = textureManager.atlas;
        if (atlas && atlas.image) {
            const debugCanvas = atlas.image.cloneNode(true);
            debugCanvas.style.position = 'fixed';
            debugCanvas.style.top = '10px';
            debugCanvas.style.right = '10px';
            debugCanvas.style.width = '256px';
            debugCanvas.style.height = '256px';
            debugCanvas.style.border = '2px solid white';
            debugCanvas.style.zIndex = '10000';
            debugCanvas.style.imageRendering = 'pixelated';
            document.body.appendChild(debugCanvas);
            console.log('DEBUG: Texture atlas canvas appended to DOM (top-right corner)');
        }
    }

    // Create MeshBuilder (Task 2.2.1)
    meshBuilder = new MeshBuilder(voxelWorld);

    // Generate 3×3 chunk grid (Task 4.5.1)
    console.log('Generating 3×3 chunk grid with textures...');
    console.time('Total terrain generation');

    let totalFaces = 0;
    let chunksGenerated = 0;

    // Generate chunks in a 3×3 grid around origin
    for (let chunkX = -1; chunkX <= 1; chunkX++) {
        for (let chunkZ = -1; chunkZ <= 1; chunkZ++) {
            const chunkY = 0; // Only generate ground level for now

            // Generate terrain for this chunk (Task 4.4.4)
            terrainGenerator.fillChunk(voxelWorld, chunkX, chunkY, chunkZ);

            // Build geometry for this chunk (Task 2.2.4, 4.3.1)
            const geometry = meshBuilder.buildChunkGeometry(chunkX, chunkY, chunkZ, textureManager);

            if (geometry) {
                // Use shared material with texture atlas
                const material = textureManager.getMaterial();

                // Debug: Log material for first chunk
                if (chunkX === -1 && chunkZ === -1) {
                    console.log('First chunk material check:', {
                        materialType: material.type,
                        hasMap: material.map !== null,
                        hasUVs: geometry.attributes.uv !== undefined,
                        uvCount: geometry.attributes.uv ? geometry.attributes.uv.count : 0
                    });
                }

                // Create mesh
                const mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);

                // Store mesh by chunk key
                const chunkKey = `${chunkX},${chunkY},${chunkZ}`;
                chunkMeshes[chunkKey] = mesh;

                totalFaces += geometry.index.count / 6;
                chunksGenerated++;
            }
        }
    }

    console.timeEnd('Total terrain generation');
    console.log(`Generated ${chunksGenerated} chunks with ${totalFaces.toFixed(0)} total faces`);

    // Store center chunk mesh for backward compatibility (Phase 3)
    chunkMesh = chunkMeshes['0,0,0'];

    // Position camera to view the terrain
    // Start player at center of world, standing on terrain
    const spawnX = 16; // Center of chunk (0,0,0)
    const spawnZ = 16;
    const spawnHeight = terrainGenerator.getTerrainHeight(spawnX, spawnZ);

    // terrainHeight is the Y coordinate of the top solid block
    // Player feet should be on top of that block at Y = terrainHeight + 1
    // Camera (eye level) is 1.6 blocks above feet
    // So camera Y = (terrainHeight + 1) + 1.6 = terrainHeight + 2.6
    const spawnY = spawnHeight + 2.6;
    camera.position.set(spawnX, spawnY, spawnZ);
    camera.lookAt(spawnX, spawnY, spawnZ - 10); // Look forward

    // Debug: Check what blocks are at spawn
    console.log(`Camera positioned at spawn: (${spawnX}, ${spawnY.toFixed(1)}, ${spawnZ}) on terrain height ${spawnHeight}`);
    console.log(`Terrain check - Block at (${spawnX}, ${spawnHeight}, ${spawnZ}):`, voxelWorld.getVoxel(spawnX, spawnHeight, spawnZ));
    console.log(`Terrain check - Block at (${spawnX}, ${spawnHeight + 1}, ${spawnZ}):`, voxelWorld.getVoxel(spawnX, spawnHeight + 1, spawnZ));
    console.log(`Terrain check - Block below player (${spawnX}, ${Math.floor(spawnY - 1.6)}, ${spawnZ}):`, voxelWorld.getVoxel(spawnX, Math.floor(spawnY - 1.6), spawnZ));
    console.log('=== Phase 4: Voxel World Ready! ===');
}

/**
 * Create selection highlight box
 * Task 3.1.4
 */
function createSelectionBox() {
    // Create wireframe box geometry
    const geometry = new THREE.BoxGeometry(1.01, 1.01, 1.01); // Slightly larger than voxel
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 2,
        fog: true // Enable fog support for selection box
    });
    selectionBox = new THREE.LineSegments(edges, material);
    selectionBox.visible = false; // Hidden by default
    scene.add(selectionBox);

    console.log('Selection highlight created');
}

/**
 * Regenerate chunk mesh after voxel modification
 * Tasks 3.2.3, 3.3.4, 4.3.2 (updated for vertex colors)
 * @param {number} worldX - World X coordinate of modified voxel
 * @param {number} worldY - World Y coordinate of modified voxel
 * @param {number} worldZ - World Z coordinate of modified voxel
 */
function regenerateChunk(worldX, worldY, worldZ) {
    console.time('Chunk regeneration');

    // Determine which chunk was affected
    const chunkX = Math.floor(worldX / voxelWorld.cellSize);
    const chunkY = Math.floor(worldY / voxelWorld.cellSize);
    const chunkZ = Math.floor(worldZ / voxelWorld.cellSize);
    const chunkKey = `${chunkX},${chunkY},${chunkZ}`;

    // Remove old mesh (Phase 4: use chunkMeshes dictionary)
    const oldMesh = chunkMeshes[chunkKey];
    if (oldMesh) {
        scene.remove(oldMesh);
        oldMesh.geometry.dispose();
        delete chunkMeshes[chunkKey];
    }

    // Generate new geometry (Task 4.3.1: pass textureManager)
    const geometry = meshBuilder.buildChunkGeometry(chunkX, chunkY, chunkZ, textureManager);

    if (geometry) {
        // Use shared material with texture atlas
        const material = textureManager.getMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Store new mesh
        chunkMeshes[chunkKey] = mesh;

        // Update chunkMesh for backward compatibility
        if (chunkKey === '0,0,0') {
            chunkMesh = mesh;
        }
    }

    console.timeEnd('Chunk regeneration');
}

/**
 * Destroy block at raycast hit position
 * Task 3.2.2
 */
function destroyBlock() {
    const hit = raycaster.cast();

    if (hit) {
        const [x, y, z] = hit.position;
        console.log(`Destroying block at (${x}, ${y}, ${z})`);

        // Remove block
        voxelWorld.setVoxel(x, y, z, 0);

        // Regenerate chunk (Task 3.2.3)
        regenerateChunk(x, y, z);
    }
}

/**
 * Place block adjacent to raycast hit position
 * Tasks 3.3.2, 3.3.3, 3.3.4
 */
function placeBlock() {
    const hit = raycaster.cast();

    if (hit) {
        // Calculate placement position (Task 3.3.2)
        const [hitX, hitY, hitZ] = hit.position;
        const [normalX, normalY, normalZ] = hit.normal;
        const placeX = hitX + normalX;
        const placeY = hitY + normalY;
        const placeZ = hitZ + normalZ;

        console.log(`Placing block at (${placeX}, ${placeY}, ${placeZ})`);

        // Validate placement - check if block would intersect player (Task 3.3.3)
        const blockCenter = { x: placeX + 0.5, y: placeY + 0.5, z: placeZ + 0.5 };
        const wouldCollide = collision.checkAABBCollision(camera.position);

        // Simple check: is block too close to player?
        const dx = Math.abs(camera.position.x - (placeX + 0.5));
        const dy = Math.abs(camera.position.y - (placeY + 0.5));
        const dz = Math.abs(camera.position.z - (placeZ + 0.5));

        // Player AABB: 0.8 wide x 1.8 tall
        // Don't place if block is too close to player center
        if (dx < 1.0 && dy < 1.5 && dz < 1.0) {
            console.log('Cannot place block - would intersect player');
            return;
        }

        // Place block (Task 3.3.4)
        voxelWorld.setVoxel(placeX, placeY, placeZ, 1); // Type 1 = grass

        // Regenerate chunk
        regenerateChunk(placeX, placeY, placeZ);
    }
}

/**
 * Setup PointerLockControls
 * Task 1.3.2
 */
function initControls() {
    // Create PointerLockControls with camera and renderer's canvas
    controls = new THREE.PointerLockControls(camera, renderer.domElement);

    console.log('PointerLockControls initialized');
}

/**
 * Implement pointer lock activation
 * Task 1.3.3
 */
function initPointerLock() {
    const container = document.getElementById('game-container');

    // Click to activate pointer lock
    container.addEventListener('click', () => {
        controls.lock();
    });

    // Listen for lock event
    controls.addEventListener('lock', () => {
        console.log('Pointer locked');
        // Add game-active class to show crosshair (as per CSS)
        document.body.classList.add('game-active');
    });

    // Listen for unlock event
    controls.addEventListener('unlock', () => {
        console.log('Pointer unlocked');
        // Remove game-active class
        document.body.classList.remove('game-active');
    });

    console.log('Pointer lock handlers initialized');
}

/**
 * Main render loop with movement, physics, and raycasting
 * Tasks 1.2.2, 1.3.4, 1.3.5, 2.3.2, 3.1.4, 3.4.1, 3.4.2
 */
function animate(currentTime = 0) {
    requestAnimationFrame(animate);

    // Calculate delta time (Task 1.3.5)
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    // Clamp delta time to avoid large jumps
    const clampedDelta = Math.min(deltaTime, 0.1);

    // Only move if controls are locked (Task 1.3.4)
    if (controls.isLocked) {
        const moveSpeed = 5.0; // 5 units per second

        // Calculate movement velocity
        let moveVelocityX = 0;
        let moveVelocityZ = 0;

        // Get camera forward and right vectors for movement
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0; // Keep movement horizontal
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, camera.up).normalize(); // Fixed: forward × up gives right vector

        // WASD movement
        if (inputHandler.isKeyPressed('w')) {
            moveVelocityX += forward.x * moveSpeed;
            moveVelocityZ += forward.z * moveSpeed;
        }
        if (inputHandler.isKeyPressed('s')) {
            moveVelocityX -= forward.x * moveSpeed;
            moveVelocityZ -= forward.z * moveSpeed;
        }
        if (inputHandler.isKeyPressed('d')) {
            moveVelocityX += right.x * moveSpeed;
            moveVelocityZ += right.z * moveSpeed;
        }
        if (inputHandler.isKeyPressed('a')) {
            moveVelocityX -= right.x * moveSpeed;
            moveVelocityZ -= right.z * moveSpeed;
        }

        // Store horizontal velocity for collision checking
        velocity.x = moveVelocityX;
        velocity.z = moveVelocityZ;

        // ===== PHASE 2 & 3: PHYSICS, GRAVITY, COLLISION (Tasks 2.3.2, 3.4.1, 3.4.2) =====
        if (collision) {
            // Apply gravity
            const gravity = 9.8; // m/s^2
            velocity.y -= gravity * clampedDelta;

            // Check if grounded
            const grounded = collision.isGrounded(camera.position);

            // Task 3.4.2 - Jumping
            if (inputHandler.isKeyPressed('space')) {
                if (grounded) {
                    velocity.y = 5.0; // Jump impulse
                    console.log('Jump!');
                } else {
                    // Debug: log once per press (not every frame)
                    if (!this.spaceWasPressed) {
                        console.log('Cannot jump - not grounded. Camera Y:', camera.position.y.toFixed(2));
                    }
                }
            }
            this.spaceWasPressed = inputHandler.isKeyPressed('space');

            if (grounded && velocity.y <= 0) {
                // Player is on ground - stop falling
                velocity.y = 0;

                // Snap player to ground level to prevent falling through
                const groundLevel = collision.getGroundLevel(camera.position.x, camera.position.z);
                if (groundLevel !== -Infinity) {
                    // Player camera should be 1.6 units above ground (eye height)
                    const targetY = groundLevel + 1.6;
                    // Snap to ground if we're close (within 0.1 blocks)
                    if (Math.abs(camera.position.y - targetY) < 0.1) {
                        camera.position.y = targetY;
                    } else if (camera.position.y < targetY) {
                        camera.position.y = targetY;
                    }
                }
            }

            // Task 3.4.1 - Enhanced collision detection with wall sliding
            const adjustedVelocity = collision.checkCollision(camera.position, velocity, clampedDelta);

            // Apply adjusted velocity to camera position
            camera.position.x += adjustedVelocity.x * clampedDelta;
            camera.position.y += adjustedVelocity.y * clampedDelta;
            camera.position.z += adjustedVelocity.z * clampedDelta;

            // Prevent falling through floor at y=0 (safety net)
            if (camera.position.y < 1.6) {
                camera.position.y = 1.6;
                velocity.y = 0;
            }
        }

        // ===== PHASE 3: RAYCASTING AND SELECTION HIGHLIGHT (Task 3.1.4) =====
        if (raycaster && selectionBox) {
            const hit = raycaster.cast();

            if (hit) {
                // Show selection box at hit position
                const [x, y, z] = hit.position;
                selectionBox.position.set(x + 0.5, y + 0.5, z + 0.5);
                selectionBox.visible = true;
            } else {
                // Hide selection box if not looking at any block
                selectionBox.visible = false;
            }
        }
    }

    // Render the scene
    renderer.render(scene, camera);
}

/**
 * Main initialization function
 */
async function init() {
    console.log('=== Initializing Minecraft Prototype ===');

    // Phase 1: Initialize Three.js scene
    initScene();
    initResizeHandler();
    initLighting();

    // Phase 2: Create voxel world with textures (async for texture loading)
    await createVoxelWorld();

    // Initialize input and controls
    inputHandler = new InputHandler();
    initControls();
    initPointerLock();

    // Phase 2: Initialize collision system (Task 2.3.1)
    collision = new Collision(voxelWorld);

    // ===== PHASE 3: INITIALIZE RAYCASTING AND INTERACTION =====
    console.log('=== PHASE 3: Initializing Block Interaction ===');

    // Create raycaster (Tasks 3.1.1)
    raycaster = new Raycaster(voxelWorld, camera);

    // Create selection highlight (Task 3.1.4)
    createSelectionBox();

    // Register mouse click handlers (Tasks 3.2.1, 3.3.1)
    inputHandler.onPrimaryAction(() => {
        destroyBlock();
    });

    inputHandler.onSecondaryAction(() => {
        placeBlock();
    });

    console.log('Block interaction initialized');

    // Start the render loop
    animate();

    console.log('=== Game initialized successfully! Click to start playing. ===');
    console.log('Controls: WASD to move, Mouse to look, Space to jump');
    console.log('Left click to destroy blocks, Right click to place blocks');
}

// Start the game when the page loads
window.addEventListener('load', init);
