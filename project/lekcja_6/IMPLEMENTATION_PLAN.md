# Minecraft Prototype - Implementation Plan & Task List

**Status**: Not Started
**Start Date**: TBD
**Target Completion**: TBD
**Current Phase**: Phase 0 (Setup)

## ⚠️ Critical Constraint: ZERO SETUP

**MUST work by double-clicking `index.html` - no server, no build step, no npm install.**

**Implementation Approach**:
- Use `<script src="">` tags (NOT ES6 modules)
- Three.js via CDN UMD build (global `THREE` object)
- All components in global namespace or IIFEs
- See architecture.md Section 6.1 for rationale

---

## Quick Reference

**Current Sprint**: Phase 0
**Blocked Tasks**: None
**Next Up**: Environment setup and project structure

**Progress Overview**:
- [ ] Phase 0: Project Setup (0/6 tasks)
- [ ] Phase 1: Foundation - "Hello Cube" (0/11 tasks)
- [ ] Phase 2: Voxel World - "Single Chunk" (0/10 tasks)
- [ ] Phase 3: Interaction - "Build & Destroy" (0/10 tasks)
- [ ] Phase 4: World Generation - "Textured Terrain" (0/12 tasks)
- [ ] Phase 5: Infinite World - "Exploration" (0/11 tasks)
- [ ] Phase 6: Polish - "Release Candidate" (0/8 tasks)

**Total**: 0/68 tasks completed

---

## Phase 0: Project Setup & Environment

**Goal**: Create project structure and development environment
**Estimated Time**: 1 hour
**Status**: Not Started

### Tasks

- [ ] **0.1** Create project directory structure
  - Create `/css`, `/js`, `/assets/textures` folders
  - Create subdirectories: `/js/world`, `/js/rendering`, `/js/input`, `/js/physics`, `/js/utils`
  - **Validation**: All folders exist as per architecture.md Section 2.1

- [ ] **0.2** Create placeholder files
  - Create empty files for all components listed in architecture
  - Add file headers with component name and purpose
  - **Validation**: All files from architecture doc exist

- [ ] **0.3** Setup HTML boilerplate
  - Create `index.html` with basic structure
  - Add viewport meta tags for proper scaling
  - Setup container div for Three.js canvas (id="game-container")
  - Add `<script>` tags for all JS files in dependency order (see architecture.md Section 4.4)
  - **IMPORTANT**: Use regular script tags, NOT ES6 modules (must work by double-clicking HTML)
  - **Validation**: HTML validates, opens in browser by double-clicking (no server needed)

- [ ] **0.4** Link Three.js library
  - Add Three.js CDN link (r160+) via `<script src="">` tag
  - Use UMD build (NOT ES6 module): `three.min.js` from CDN
  - Include PointerLockControls from Three.js examples/js (UMD version)
  - Verify Three.js loads correctly
  - **Validation**: Console shows no 404 errors, `THREE` object available globally

- [ ] **0.5** Create basic CSS
  - Setup fullscreen canvas styling
  - Add pointer cursor styles
  - Create UI container for future HUD
  - **Validation**: Page renders fullscreen, no scrollbars

- [ ] **0.6** Initialize Git repository
  - Run `git init`
  - Create `.gitignore` (node_modules, .DS_Store, etc.)
  - Make initial commit
  - **Validation**: `git status` shows clean working tree

**Phase 0 Complete When**:
- All files and folders created
- HTML loads without errors
- Three.js library accessible
- Git initialized

---

## Phase 1: Foundation - "Hello Cube"

**Goal**: Three.js scene with camera controls and single test cube
**Estimated Time**: 2-3 hours
**Status**: Not Started
**Prerequisites**: Phase 0 complete

### Tasks

#### 1.1 Three.js Scene Setup

- [ ] **1.1.1** Create `js/main.js` - Scene initialization
  - Initialize THREE.Scene
  - Setup perspective camera (FOV 75, aspect ratio, near 0.1, far 1000)
  - Create WebGLRenderer with canvas
  - Set renderer size to window dimensions
  - **Validation**: Black canvas renders
  - **Reference**: Architecture 3.2

- [ ] **1.1.2** Add window resize handler
  - Listen to window resize events
  - Update camera aspect ratio
  - Update renderer size
  - **Validation**: Canvas resizes with window, no distortion

- [ ] **1.1.3** Add lighting
  - Create AmbientLight (color: 0xffffff, intensity: 0.6)
  - Create DirectionalLight (color: 0xffffff, intensity: 0.8)
  - Position directional light at (5, 10, 7.5)
  - Add lights to scene
  - **Validation**: Scene has visible lighting

#### 1.2 Test Cube

- [ ] **1.2.1** Create test cube geometry
  - Create BoxGeometry(1, 1, 1)
  - Create MeshLambertMaterial with color
  - Create mesh and add to scene
  - Position camera to view cube
  - **Validation**: Colored cube visible in center of screen

- [ ] **1.2.2** Implement basic render loop
  - Create `animate()` function
  - Call `requestAnimationFrame(animate)`
  - Call `renderer.render(scene, camera)`
  - **Validation**: Cube renders continuously, 60 FPS

#### 1.3 Camera Controls

- [ ] **1.3.1** Create `js/input/InputHandler.js`
  - Track keyboard state in object: `{w: false, a: false, s: false, d: false, space: false}`
  - Listen to keydown/keyup events
  - Update state object on key events
  - Implement `isKeyPressed(key)` method
  - **Validation**: Console.log shows correct key states
  - **Reference**: Architecture 3.3

- [ ] **1.3.2** Setup PointerLockControls
  - Import PointerLockControls from Three.js addons
  - Create controls instance with camera and renderer.domElement
  - Add controls to scene
  - **Validation**: Controls object exists

- [ ] **1.3.3** Implement pointer lock activation
  - Add click event listener to canvas
  - Call `controls.lock()` on click
  - Add lock/unlock event listeners
  - Show/hide crosshair on lock state change
  - **Validation**: Clicking canvas locks pointer, ESC unlocks

- [ ] **1.3.4** Implement WASD movement
  - In render loop, check InputHandler key states
  - Call `controls.moveForward(speed)` if W pressed
  - Call `controls.moveForward(-speed)` if S pressed
  - Call `controls.moveRight(speed)` if D pressed
  - Call `controls.moveRight(-speed)` if A pressed
  - Use speed = 0.1 for testing
  - **Validation**: Camera moves with WASD keys

- [ ] **1.3.5** Add delta time
  - Track last frame time
  - Calculate delta time between frames
  - Multiply movement speed by delta
  - **Validation**: Movement speed consistent regardless of framerate

**Phase 1 Acceptance Criteria**:
- ✓ Scene renders at 60 FPS
- ✓ Test cube visible with proper lighting
- ✓ Pointer lock works (click to lock, ESC to unlock)
- ✓ WASD movement smooth and responsive
- ✓ No console errors

**Phase 1 Complete When**:
All tasks checked AND acceptance criteria met

---

## Phase 2: Voxel World - "Single Chunk"

**Goal**: Render optimized 32³ chunk with face culling
**Estimated Time**: 3-4 hours
**Status**: Not Started
**Prerequisites**: Phase 1 complete

### Tasks

#### 2.1 VoxelWorld Core

- [ ] **2.1.1** Create `js/world/VoxelWorld.js` - Basic structure
  - Define class with constructor(cellSize = 32)
  - Initialize cells storage: `this.cells = {}`
  - **Validation**: Can instantiate VoxelWorld
  - **Reference**: Architecture 3.1

- [ ] **2.1.2** Implement coordinate translation methods
  - `computeCellId(x, y, z)` → returns chunk coordinates
  - `computeVoxelOffset(x, y, z)` → returns index in Uint8Array
  - Use `Math.floor(coord / cellSize)` for chunk coords
  - **Validation**: Test with known coordinates, verify math
  - **Reference**: Architecture 3.1 - State Representation

- [ ] **2.1.3** Implement voxel storage
  - `setVoxel(x, y, z, v)` - sets voxel value
  - `getVoxel(x, y, z)` - returns voxel value (0 if empty)
  - Create Uint8Array for chunk if doesn't exist
  - **Validation**: Set and get voxels, verify values persist

- [ ] **2.1.4** Implement query methods
  - `hasChunk(chunkX, chunkY, chunkZ)` - returns boolean if chunk exists
  - `getChunkBounds(chunkX, chunkY, chunkZ)` - returns BoundingBox (optional)
  - **Validation**: Query methods return correct values
  - **Reference**: Architecture 3.1 - Critical API Contract

- [ ] **2.1.5** Create test terrain data
  - Generate flat terrain at y=0 to y=10
  - Fill with block type 1 (will be grass later)
  - Only generate for single chunk (0, 0, 0)
  - **Validation**: Can query voxels, bottom layers are solid

#### 2.2 Mesh Generation

- [ ] **2.2.1** Create `js/rendering/MeshBuilder.js` - Setup
  - Define class with constructor(world)
  - Store reference to VoxelWorld
  - Define face data (normals, vertices, UVs for each direction)
  - **Validation**: Class instantiates
  - **Reference**: Architecture 3.2

- [ ] **2.2.2** Implement face culling logic
  - For each voxel, check all 6 neighbors
  - Only add face if neighbor is air (value === 0)
  - Handle chunk boundaries (check across chunks)
  - **Validation**: Log face count, should be ~85% less than full cube count
  - **Reference**: Architecture 3.2 - Geometry Generation Strategy

- [ ] **2.2.3** Build geometry arrays
  - Create arrays for positions, normals, UVs, indices
  - For each visible face, add quad (4 vertices, 2 triangles)
  - Calculate proper vertex positions based on voxel coords
  - Add appropriate normals for each face direction
  - **Validation**: Arrays have correct length relationships

- [ ] **2.2.4** Create BufferGeometry
  - Create THREE.BufferGeometry()
  - Set position attribute (Float32Array)
  - Set normal attribute (Float32Array)
  - Set UV attribute (Float32Array) - temp values OK
  - Set index (Uint16Array)
  - Compute bounding sphere
  - **Validation**: Geometry object created without errors
  - **Reference**: Architecture 3.2 - Optimization Requirements

- [ ] **2.2.5** Integrate with main scene
  - In main.js, create VoxelWorld instance
  - Create MeshBuilder instance
  - Generate geometry for chunk (0, 0, 0)
  - Create mesh with MeshLambertMaterial
  - Add mesh to scene
  - Remove test cube
  - **Validation**: Voxel chunk renders in scene

#### 2.3 Physics - Basic Collision

- [ ] **2.3.1** Create `js/physics/Collision.js` - Ground check
  - Implement `isGrounded(position, world)` method
  - Check voxel below player position
  - Return true if voxel is solid
  - **Validation**: Returns true on ground, false in air
  - **Reference**: Architecture 3.4

- [ ] **2.3.2** Apply gravity in Controls
  - Add velocity.y property
  - Apply gravity: `velocity.y -= 9.8 * deltaTime`
  - If grounded, set velocity.y = 0
  - Update camera position by velocity
  - **Validation**: Player falls when in air, stops on ground

**Phase 2 Acceptance Criteria**:
- ✓ Single 32³ chunk renders with voxels
- ✓ Face culling working (verify in DevTools: geometry has ~85% fewer faces)
- ✓ Chunk generation completes in <10ms (use console.time/timeEnd)
- ✓ Player doesn't fall through terrain
- ✓ Maintains 60 FPS
- ✓ Memory usage reasonable (<10MB for single chunk)

**Phase 2 Complete When**:
All tasks checked AND acceptance criteria met

---

## Phase 3: Interaction - "Build & Destroy"

**Goal**: Block selection, placement, and destruction
**Estimated Time**: 2-3 hours
**Status**: Not Started
**Prerequisites**: Phase 2 complete

### Tasks

#### 3.1 Raycasting

- [ ] **3.1.1** Create `js/utils/Raycaster.js` - Setup
  - Create class with constructor(world, camera)
  - Store references to world and camera
  - Initialize THREE.Raycaster
  - **Validation**: Class instantiates
  - **Reference**: Architecture 3.5

- [ ] **3.1.2** Implement ray casting
  - Create `cast(maxDistance = 10)` method
  - Get camera position and direction
  - Step through voxel grid using DDA or Three.js raycaster
  - Return hit result: {position, normal, distance, voxelType}
  - Return null if no hit
  - **Validation**: Console.log hit results when looking at blocks
  - **Reference**: Architecture 3.5 - Raycasting Algorithm

- [ ] **3.1.3** Determine hit face
  - Calculate which face of voxel was hit
  - Return face normal (±X, ±Y, ±Z as Vector3)
  - **Validation**: Face normal matches visible face

- [ ] **3.1.4** Add selection highlight
  - Create wireframe box geometry
  - Position at selected block location
  - Show/hide based on raycast result
  - **Validation**: Highlight box surrounds looked-at block

#### 3.2 Block Destruction

- [ ] **3.2.1** Add mouse click handlers
  - In InputHandler, add `onPrimaryAction` callback registration
  - Listen for mousedown events during pointer lock
  - Fire callback on left click (button === 0)
  - **Validation**: Console.log fires on left click

- [ ] **3.2.2** Implement destroy block
  - On left click, get raycast result
  - If hit, call `world.setVoxel(x, y, z, 0)`
  - **Validation**: Voxel data changes to 0

- [ ] **3.2.3** Regenerate chunk mesh
  - After destroying block, regenerate chunk geometry
  - Dispose old geometry
  - Create new mesh
  - Update scene
  - **Validation**: Block visually disappears
  - **Performance**: Regeneration takes <16ms

#### 3.3 Block Placement

- [ ] **3.3.1** Add right-click handler
  - In InputHandler, add `onSecondaryAction` callback
  - Listen for right click / contextmenu
  - Prevent default context menu
  - **Validation**: Right click fires callback, no context menu

- [ ] **3.3.2** Calculate placement position
  - Get raycast hit position and normal
  - Add normal to position: `placePos = hitPos + normal`
  - **Validation**: Placement position is adjacent to hit block

- [ ] **3.3.3** Validate placement
  - Check placement position not inside player AABB
  - Player AABB: 0.8 wide × 1.8 tall, centered on camera
  - Don't place if would intersect player
  - **Validation**: Can't place block inside self
  - **Reference**: Architecture 3.5 - Block Placement Validation

- [ ] **3.3.4** Implement place block
  - On right click, calculate placement position
  - Validate placement
  - Call `world.setVoxel(x, y, z, 1)`
  - Regenerate chunk mesh
  - **Validation**: New block appears

#### 3.4 Enhanced Physics

- [ ] **3.4.1** Improve collision detection
  - Check all voxels intersecting player AABB
  - Prevent movement into solid blocks
  - Allow sliding along walls
  - **Validation**: Can't walk through blocks, can slide along edges
  - **Reference**: Architecture 3.4 - Collision Algorithm

- [ ] **3.4.2** Add jumping
  - If space pressed and grounded, set velocity.y = 5
  - **Validation**: Player jumps when space pressed on ground

**Phase 3 Acceptance Criteria**:
- ✓ Can look at blocks and see selection highlight
- ✓ Left click destroys blocks
- ✓ Right click places blocks
- ✓ Block placement validation works (can't place in self)
- ✓ Chunk regenerates in <16ms
- ✓ Collision prevents walking through blocks
- ✓ Can jump with space bar
- ✓ Maintains 60 FPS during block edits

**Phase 3 Complete When**:
All tasks checked AND acceptance criteria met

---

## Phase 4: World Generation - "Textured Terrain"

**Goal**: Procedural terrain with textures across multiple chunks
**Estimated Time**: 4-5 hours
**Status**: Not Started
**Prerequisites**: Phase 3 complete

### Tasks

#### 4.1 Texture Assets

- [ ] **4.1.1** Research and download textures
  - Visit mcasset.cloud or GitHub Oversized pack
  - Download 10 block textures: grass, dirt, stone, cobblestone, sand, wood log, planks, leaves, glass, bedrock
  - Each needs: top, side, bottom variants (16×16 pixels)
  - **Validation**: Have 30 texture files (10 blocks × 3 faces)
  - **Reference**: Architecture Section 8.2

- [ ] **4.1.2** Create texture atlas
  - Open image editor (GIMP, Photoshop, Photopea)
  - Create 256×256 canvas
  - Arrange textures: columns = block types, rows = faces
  - Row 0: all top faces, Row 1: all side faces, Row 2: all bottom faces
  - Export as `assets/textures/atlas.png`
  - **Validation**: Atlas is 256×256, tiles visible and aligned
  - **Reference**: Architecture 3.2 - Texture Atlas Structure

- [ ] **4.1.3** Document block type mapping
  - Create comment/doc listing block type IDs:
    - 0: Air
    - 1: Grass
    - 2: Dirt
    - 3: Stone
    - etc.
  - **Validation**: Reference doc exists with all 10 types

#### 4.2 Texture Manager

- [ ] **4.2.1** Create `js/rendering/TextureManager.js` - Setup
  - Define class TextureManager
  - Store atlas dimensions, tile size
  - **Validation**: Class instantiates
  - **Reference**: Architecture 3.2 - TextureManager

- [ ] **4.2.2** Load texture atlas
  - Implement `loadAtlas(path)` returning Promise
  - Use THREE.TextureLoader
  - Set texture.magFilter = THREE.NearestFilter
  - Set texture.minFilter = THREE.NearestFilter
  - **Validation**: Texture loads, no console errors
  - **Reference**: Architecture 3.2 - Material Configuration

- [ ] **4.2.3** Implement UV calculation
  - `getUVForFace(blockType, face, corner)` returns [u, v]
  - Calculate column from blockType (blockType - 1)
  - Calculate row from face (top=0, side=1, bottom=2)
  - Calculate u, v based on corner position
  - **Validation**: Test calculations, UVs in range [0, 1]
  - **Reference**: Architecture 3.2 - Texture Atlas Structure

- [ ] **4.2.4** Create textured material
  - Create MeshLambertMaterial with texture map
  - Set `magFilter` and `minFilter` to `THREE.NearestFilter`
  - Set `colorSpace` to `THREE.SRGBColorSpace`
  - Set `side` to `THREE.FrontSide` (enable backface culling)
  - Make material available via `getMaterial()`
  - **Validation**: Material created with all settings correct
  - **Reference**: Architecture 3.2 - Material Configuration

#### 4.3 Update Mesh Builder

- [ ] **4.3.1** Integrate texture UVs
  - In MeshBuilder, use TextureManager for UV coords
  - For each face, get blockType of voxel
  - Calculate UVs for each corner using TextureManager
  - Add UVs to geometry UV attribute
  - **Validation**: UVs assigned per face based on block type

- [ ] **4.3.2** Update material
  - Use textured material from TextureManager
  - Remove solid color material
  - **Validation**: Blocks render with textures

#### 4.4 Terrain Generation

- [ ] **4.4.1** Create `js/world/TerrainGenerator.js` - Noise setup
  - Research/choose noise library (or implement simple noise)
  - Create class with seed parameter
  - Implement 2D Perlin/Simplex noise function
  - **Validation**: Noise function returns deterministic values
  - **Reference**: Architecture 3.1 - TerrainGenerator

- [ ] **4.4.2** Implement height map generation
  - `getTerrainHeight(worldX, worldZ)` returns Y value
  - Use noise with appropriate scale (e.g., frequency = 0.05)
  - Add multiple octaves for detail
  - Return height in range 0-30
  - **Validation**: Height function produces smooth terrain

- [ ] **4.4.3** Implement layer-based generation
  - In TerrainGenerator, `generateChunkData(chunkX, chunkY, chunkZ)`
  - For each XZ position, calculate height
  - Fill layers: surface = grass (1), below = dirt (2), deeper = stone (3), bottom = bedrock (6)
  - Use surface-only optimization (don't fill empty air)
  - Return Uint8Array with chunk data
  - **Validation**: Chunk has varied terrain with correct layers
  - **Reference**: Architecture 3.1 - Generation Algorithm Requirements

- [ ] **4.4.4** Integrate with VoxelWorld
  - In VoxelWorld, use TerrainGenerator when creating new chunks
  - Replace flat terrain with generated terrain
  - **Validation**: Terrain has hills and valleys

#### 4.5 Multi-Chunk World

- [ ] **4.5.1** Generate 3×3 chunk grid
  - In main.js, generate 9 chunks: (-1,0,-1) to (1,0,1)
  - Y=0 only for now (single layer)
  - Create mesh for each chunk
  - Position meshes correctly in world space
  - **Validation**: 3×3 grid visible, terrain continuous
  - **Reference**: Architecture Section 7 Phase 4

- [ ] **4.5.2** Test chunk boundaries
  - Walk across chunk boundaries
  - Verify no visual seams
  - Verify terrain height continuous
  - Place/destroy blocks at chunk edges
  - **Validation**: Seamless world, no artifacts at boundaries

- [ ] **4.5.3** Performance testing
  - Measure FPS with 9 chunks
  - Check memory usage in DevTools
  - Profile chunk generation time
  - **Validation**: 60 FPS maintained, <50MB memory

**Phase 4 Acceptance Criteria**:
- ✓ Texture atlas loads and displays correctly
- ✓ Different block types show different textures
- ✓ Terrain generates with natural-looking hills/valleys
- ✓ 3×3 chunk grid renders seamlessly
- ✓ Grass top/side textures correct
- ✓ No seams between chunks
- ✓ Maintains 60 FPS with 9 chunks
- ✓ Textures are pixelated (not blurry)

**Phase 4 Complete When**:
All tasks checked AND acceptance criteria met

---

## Phase 5: Infinite World - "Exploration"

**Goal**: Dynamic chunk loading/unloading for infinite world
**Estimated Time**: 5-8 hours
**Status**: Not Started
**Prerequisites**: Phase 4 complete

### Tasks

#### 5.1 Chunk Manager

- [ ] **5.1.1** Create `js/world/ChunkManager.js` - Setup
  - Define class with constructor(world, terrainGenerator)
  - Store loaded chunks map: `{chunkKey: mesh}`
  - Store dirty chunks set
  - Define load/unload radii config
  - **Validation**: Class instantiates
  - **Reference**: Architecture 3.1 - ChunkManager
  - **Design Note**: For prototype simplicity, using direct method calls instead of event callbacks (onChunkLoad/onChunkUnload/onChunkDirty). This creates tighter coupling but reduces complexity. Can refactor to event system in v2 if needed.

- [ ] **5.1.2** Implement chunk key calculation
  - `getChunkKey(x, y, z)` returns string "x,y,z"
  - `getChunkCoordsFromKey(key)` parses back to [x, y, z]
  - **Validation**: Keys are deterministic and reversible

- [ ] **5.1.3** Track player chunk position
  - Each frame, calculate which chunk player is in
  - Track when player changes chunks
  - **Validation**: Console.log shows chunk changes

- [ ] **5.1.4** Calculate required chunks
  - `getRequiredChunks(playerPos, radius)` returns array of chunk coords
  - Generate sphere of chunks around player
  - Use Manhattan or Euclidean distance
  - **Validation**: Returns correct set of chunks for given radius
  - **Reference**: Architecture 3.1 - Loading Strategy

#### 5.2 Dynamic Loading

- [ ] **5.2.1** Implement chunk loading
  - `loadChunk(chunkX, chunkY, chunkZ)` method
  - Generate terrain data
  - Build mesh geometry
  - Create and position mesh
  - Add to scene and tracked chunks
  - **Validation**: New chunk appears when requested

- [ ] **5.2.2** Implement load queue
  - Maintain priority queue of chunks to load
  - Sort by distance to player (nearest first)
  - Process max 2 chunks per frame (configurable)
  - **Validation**: Chunks load in order, no frame drops
  - **Reference**: Architecture 3.1 - Loading Strategy

- [ ] **5.2.3** Integrate with update loop
  - In main.js, call `chunkManager.update(playerPos)` each frame
  - ChunkManager loads required chunks
  - **Validation**: Chunks appear as player moves

#### 5.3 Dynamic Unloading

- [ ] **5.3.1** Implement chunk unloading
  - `unloadChunk(chunkKey)` method
  - Remove mesh from scene
  - Dispose geometry and materials
  - Remove from tracked chunks
  - **Validation**: Chunk disappears, memory freed

- [ ] **5.3.2** Implement unload strategy
  - Identify chunks beyond unload radius
  - Add to unload queue
  - Unload oldest/farthest chunks first
  - **Validation**: Distant chunks unload automatically
  - **Reference**: Architecture 3.1 - Loading Strategy

- [ ] **5.3.3** Verify memory management
  - Play for 5+ minutes, moving around
  - Monitor memory usage in DevTools
  - Should stay relatively constant (not continuously growing)
  - **Validation**: No memory leaks, memory stable

#### 5.4 Chunk Boundaries & Dirty Tracking

- [ ] **5.4.1** Implement dirty chunk marking
  - When block edited, mark chunk as dirty
  - If edit on chunk edge, mark neighbor chunks dirty too
  - Store dirty chunks in Set
  - **Validation**: Correct chunks marked when placing/destroying blocks
  - **Reference**: Architecture 3.1 - Boundary Conditions

- [ ] **5.4.2** Implement chunk regeneration
  - Process dirty chunks each frame (budget: 1-2 per frame)
  - Regenerate geometry for dirty chunks
  - Clear dirty flag after regeneration
  - **Validation**: Neighbor chunks update when edge blocks modified

- [ ] **5.4.3** Test boundary edits
  - Place/destroy blocks on chunk edges
  - Verify neighbor faces update correctly
  - No visual artifacts or missing faces
  - **Validation**: Seamless block edits across boundaries

#### 5.5 Optimization & Polish

- [ ] **5.5.1** Add fog
  - Create THREE.Fog with appropriate color and distance
  - Set scene.fog
  - Tune start/end distances to hide chunk pop-in
  - **Validation**: Distant chunks fade smoothly

- [ ] **5.5.2** Optimize chunk generation
  - Profile chunk generation with console.time
  - Optimize hot paths if needed
  - Target: <16ms per chunk generation
  - **Validation**: Generation fast enough for smooth play

- [ ] **5.5.3** Add loading indicator
  - Show simple UI when chunks loading
  - Hide when caught up
  - **Validation**: Player knows when system is working

**Phase 5 Acceptance Criteria**:
- ✓ Chunks load ahead of player movement
- ✓ Chunks unload behind player
- ✓ Can walk infinitely in any direction
- ✓ No frame drops during chunk transitions
- ✓ Memory usage stable over 10+ minutes
- ✓ Block edits work across chunk boundaries
- ✓ Fog hides chunk pop-in gracefully
- ✓ Maintains 60 FPS with 50-100 loaded chunks

**Phase 5 Complete When**:
All tasks checked AND acceptance criteria met

---

## Phase 6: Polish - "Release Candidate"

**Goal**: Optimization, visual improvements, and final polish
**Estimated Time**: 2-10 hours (variable based on scope)
**Status**: Not Started
**Prerequisites**: Phase 5 complete

### Tasks

#### 6.1 Performance Optimization

- [ ] **6.1.1** Profile performance
  - Use Chrome DevTools Performance tab
  - Record 30 seconds of gameplay
  - Identify bottlenecks (rendering, physics, chunk gen)
  - Document findings
  - **Validation**: Know where time is spent

- [ ] **6.1.2** Implement greedy meshing (OPTIONAL)
  - Research 0fps.net greedy meshing algorithm
  - Implement in MeshBuilder as alternative strategy
  - Merge coplanar adjacent faces into larger quads
  - Compare performance vs face culling
  - **Validation**: Geometry count reduced 10-50×
  - **Reference**: Architecture 6.5 - Face Culling vs Greedy Meshing

- [ ] **6.1.3** Optimize hot paths
  - Based on profiling, optimize slowest functions
  - Consider object pooling for frequently created objects
  - Optimize voxel lookups (spatial hashing?)
  - **Validation**: Performance improvement measurable

#### 6.2 Visual Polish

- [ ] **6.2.1** Add sky
  - Create sky dome or sky box
  - Use gradient shader or texture
  - **Validation**: Nice looking sky background

- [ ] **6.2.2** Improve lighting (OPTIONAL)
  - Experiment with additional light sources
  - Tune light intensity and colors
  - Consider simple ambient occlusion
  - **Validation**: Better depth perception, more atmospheric

- [ ] **6.2.3** Add ambient occlusion (OPTIONAL)
  - Per-vertex AO based on neighbor configuration
  - Darken vertices where blocks meet
  - **Validation**: Corners look darker, improves 3D feel
  - **Reference**: Architecture 5.2 - Lighting System

#### 6.3 UI/UX Improvements

- [ ] **6.3.1** Add crosshair
  - CSS-based crosshair in center of screen
  - Show during pointer lock
  - **Validation**: Easy to see where aiming

- [ ] **6.3.2** Add block inventory UI (OPTIONAL)
  - Hotbar showing available block types
  - Number keys 1-9 to select block type
  - Visual indicator of selected block
  - **Validation**: Can select and place different blocks

- [ ] **6.3.3** Add HUD information
  - Display current position
  - Display current chunk
  - Display FPS counter
  - **Validation**: Debug info visible and accurate

#### 6.4 Final Testing

- [ ] **6.4.1** Cross-browser testing
  - Test in Chrome, Firefox, Safari, Edge
  - Document any issues
  - Fix critical bugs
  - **Validation**: Works in all major browsers

- [ ] **6.4.2** Extended play testing
  - Play for 30+ minutes
  - Try to break things
  - Test edge cases
  - **Validation**: Stable, no crashes or glitches

**Phase 6 Acceptance Criteria**:
- ✓ Consistent 60 FPS with 50+ chunks
- ✓ Memory usage <50MB
- ✓ No visual glitches or artifacts
- ✓ Professional looking (sky, lighting, fog)
- ✓ Works in major browsers
- ✓ Stable during extended play

**Phase 6 Complete When**:
All critical tasks checked AND acceptance criteria met

---

## Testing Checklist

### Functional Testing

**Controls**:
- [ ] WASD movement works smoothly
- [ ] Mouse look works (pointer lock)
- [ ] Jumping works (space bar)
- [ ] Can't walk through blocks
- [ ] Movement speed feels right

**Block Interaction**:
- [ ] Left click destroys blocks
- [ ] Right click places blocks
- [ ] Selection highlight follows cursor
- [ ] Can't place blocks in self
- [ ] Block edits work at chunk boundaries

**World Generation**:
- [ ] Terrain looks natural
- [ ] No chunk seams visible
- [ ] Chunks load ahead of player
- [ ] Chunks unload behind player
- [ ] Infinite world works in all directions

**Visuals**:
- [ ] Textures display correctly
- [ ] Textures are pixelated (not blurry)
- [ ] Lighting looks good
- [ ] Fog hides chunk pop-in
- [ ] No Z-fighting or visual glitches

### Performance Testing

- [ ] Maintains 60 FPS with target chunk count
- [ ] No frame drops during chunk loading
- [ ] No frame drops during block edits
- [ ] Memory usage stable over time
- [ ] Chunk generation fast enough (<16ms)
- [ ] Mesh generation fast enough (<10ms)

### Stress Testing

- [ ] Walk continuously for 10 minutes - no issues
- [ ] Rapidly place/destroy many blocks - no crashes
- [ ] Load 100+ chunks - acceptable performance
- [ ] Destroy large area of terrain - handles well

---

## Known Issues & Blockers

**Current Blockers**: None

**Known Issues**:
- (List issues here as discovered)

**Technical Debt**:
- (List shortcuts taken that need revisiting)

---

## Development Notes

### Useful Commands

```bash
# Start local server
python3 -m http.server 8000
# or
npx http-server

# Open in browser
open http://localhost:8000
```

### Debugging Tips

1. **FPS Counter**: Use `stats.js` library or custom counter
2. **Memory**: Chrome DevTools → Memory → Take snapshot
3. **Performance**: Chrome DevTools → Performance → Record
4. **Geometry count**: `console.log(scene.children.length)` and check mesh.geometry.attributes
5. **Chunk tracking**: Log chunk manager state each frame

### Code Review Checkpoints

**After Phase 2**:
- Review VoxelWorld API implementation
- Verify coordinate conversions correct
- Check face culling math

**After Phase 4**:
- Review texture UV calculations
- Verify chunk boundaries seamless
- Check terrain generation determinism

**After Phase 5**:
- Review memory management (no leaks)
- Verify chunk loading/unloading correct
- Check edge case handling

---

## References

- **Architecture Document**: See `architecture.md` for detailed design decisions
- **Three.js Docs**: https://threejs.org/docs/
- **Three.js Voxel Tutorial**: https://threejs.org/manual/en/voxel-geometry.html
- **Greedy Meshing**: https://0fps.net/2012/06/30/meshing-in-a-minecraft-game/
- **Texture Resources**: Listed in architecture.md Section 8.2

---

## Progress Tracking

**Last Updated**: [Date]
**Current Sprint**: Phase X
**Completed Today**:
-

**Tomorrow's Focus**:
-

**Blockers**:
- None

---

**Total Progress**: 0/68 tasks (0%)
