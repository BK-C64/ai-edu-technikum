# Voxel Game Prototype - Software Architecture Document

**Version**: 1.0
**Author**: Tech Lead
**Audience**: Development Team
**Last Updated**: 2025-11-11

---

## 1. Executive Summary

This document defines the software architecture for a browser-based voxel game prototype inspired by Minecraft. It establishes system boundaries, component responsibilities, data flow contracts, and architectural constraints necessary for implementing an infinite, chunked 3D world with player interaction.

### Architectural Goals

1. **Modularity**: Clear separation between rendering, world management, input, and physics
2. **Performance**: Support 50-100 active chunks at 60 FPS
3. **Scalability**: Infinite world generation through chunk-based architecture
4. **Extensibility**: Easy addition of new block types, mechanics, and features
5. **Simplicity**: Pure JavaScript implementation without build toolchain complexity

### Non-Goals (Out of Scope)

- Multiplayer/networking capabilities
- Persistent storage beyond localStorage
- Mobile/touch support
- Server-side world generation
- Advanced lighting/shadow systems (deferred to v2)

---

## 2. System Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Main Game Loop                        │
│                     (60 FPS tick cycle)                      │
└────────┬────────────────────────────────────────────┬────────┘
         │                                            │
         ▼                                            ▼
┌─────────────────────┐                    ┌──────────────────────┐
│   Input Subsystem   │                    │  Rendering Subsystem │
│  ┌───────────────┐  │                    │   ┌──────────────┐   │
│  │ PointerLock   │  │                    │   │ Three.js     │   │
│  │ Controls      │  │                    │   │ Renderer     │   │
│  ├───────────────┤  │                    │   ├──────────────┤   │
│  │ Input Handler │  │                    │   │ Mesh Builder │   │
│  │ (WASD/Mouse)  │  │                    │   ├──────────────┤   │
│  └───────────────┘  │                    │   │ Texture Mgr  │   │
└──────────┬──────────┘                    │   └──────────────┘   │
           │                                └──────────┬───────────┘
           │                                           │
           ▼                                           │
┌─────────────────────┐                               │
│  Physics Subsystem  │                               │
│  ┌───────────────┐  │                               │
│  │ Collision     │  │                               │
│  │ Detection     │  │                               │
│  ├───────────────┤  │                               │
│  │ Gravity/Move  │  │                               │
│  └───────────────┘  │                               │
└──────────┬──────────┘                               │
           │                                           │
           │          ┌──────────────────────┐        │
           └─────────►│  World Subsystem     │◄───────┘
                      │  ┌────────────────┐  │
                      │  │ Voxel World    │  │
                      │  │ (Core State)   │  │
                      │  ├────────────────┤  │
                      │  │ Chunk Manager  │  │
                      │  ├────────────────┤  │
                      │  │ Terrain Gen    │  │
                      │  └────────────────┘  │
                      └──────────────────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │  Raycaster       │
                      │  (Block Select)  │
                      └──────────────────┘
```

### 2.2 Subsystem Responsibilities

| Subsystem | Responsibility | Owns State For |
|-----------|----------------|----------------|
| **World** | Voxel data storage, chunk lifecycle, terrain generation | All voxel data, chunk metadata |
| **Rendering** | Geometry generation, mesh management, textures | GPU resources, materials |
| **Input** | Player commands, camera control | Input state, camera position |
| **Physics** | Collision detection, movement validation | Player velocity, position |
| **Raycaster** | Block selection, placement validation | Current selection state |

### 2.3 Data Flow

```
Input Event → Input Handler → Physics (collision check) → World (state mutation)
                                                              ↓
                                                         Chunk Manager (mark dirty)
                                                              ↓
                                                         Rendering (regenerate mesh)
```

**Critical Invariant**: All voxel state mutations must flow through the World subsystem to maintain consistency.

---

## 3. Core Subsystems

### 3.1 World Subsystem

#### Purpose
Authoritative source for all voxel data. Manages chunk lifecycle and provides coordinate-space abstractions.

#### Responsibilities
1. Store voxel data in sparse chunk structure
2. Translate world coordinates ↔ chunk/local coordinates
3. Provide thread-safe read/write access to voxel data
4. Trigger chunk generation for unloaded regions
5. Notify dependent systems of state changes

#### Component: VoxelWorld (Core State)

**Critical API Contract**:
```javascript
class VoxelWorld {
  // Primary state access
  getVoxel(worldX, worldY, worldZ): uint8
  setVoxel(worldX, worldY, worldZ, blockType: uint8): void

  // Coordinate translation
  computeChunkKey(worldX, worldY, worldZ): string
  computeVoxelOffset(localX, localY, localZ): uint32

  // Chunk lifecycle
  generateChunk(chunkX, chunkY, chunkZ): Chunk
  unloadChunk(chunkX, chunkY, chunkZ): void

  // Query interface
  hasChunk(chunkX, chunkY, chunkZ): boolean
  getChunkBounds(chunkX, chunkY, chunkZ): BoundingBox
}
```

**State Representation**:
- **Storage**: `Map<string, Chunk>` where key = "x,y,z"
- **Chunk Data**: `Uint8Array[cellSize³]` (default 32³ = 32,768 bytes)
- **Block Type Encoding**: 0 = air, 1-255 = material types

**Design Constraints**:
- Must support concurrent reads (physics, rendering, raycasting)
- Writes must be serialized (single-threaded modification)
- Chunk key format must be deterministic and collision-free
- Memory footprint: O(loaded chunks), not O(world size)

**Extension Points**:
- Block metadata (future): Extend Uint8Array → Uint16Array or separate metadata map
- Chunk compression: Implement RLE or sparse storage for homogeneous regions
- Version migration: Chunk serialization format must be versioned

#### Component: ChunkManager

**Responsibilities**:
1. Determine which chunks should be loaded based on player position
2. Prioritize chunk generation (player height first, nearest to farthest)
3. Implement unload strategy (LRU, distance-based)
4. Track "dirty" chunks requiring mesh regeneration
5. Coordinate with TerrainGenerator for procedural generation

**Critical API Contract**:
```javascript
class ChunkManager {
  // Called every frame
  updateActiveChunks(playerPosition: Vector3): void

  // Chunk state queries
  isChunkLoaded(chunkX, chunkY, chunkZ): boolean
  isChunkDirty(chunkX, chunkY, chunkZ): boolean

  // Lifecycle events (hook points)
  onChunkLoad(callback: (chunk: Chunk) => void): void
  onChunkUnload(callback: (chunk: Chunk) => void): void
  onChunkDirty(callback: (chunkKey: string) => void): void
}
```

**Loading Strategy** (configurable parameters):
```javascript
{
  renderRadius: 5,      // Chunks within this distance always rendered
  loadRadius: 8,        // Chunks loaded but may be culled
  unloadRadius: 12,     // Beyond this, chunks unloaded
  maxLoadsPerFrame: 2,  // Throttle generation to avoid frame drops
  priorityQueue: 'nearest-first' | 'height-first'
}
```

**Boundary Conditions**:
- Editing voxel at chunk edge (x/y/z = 0 or cellSize-1) dirties up to 3 neighboring chunks
- Chunk generation must check neighbors for seamless terrain features (trees, structures)

#### Component: TerrainGenerator

**Responsibilities**:
1. Generate voxel data for new chunks using procedural algorithms
2. Maintain deterministic generation (same seed → same world)
3. Support multiple biomes/generation strategies

**Critical API Contract**:
```javascript
class TerrainGenerator {
  generateChunkData(chunkX, chunkY, chunkZ, seed: number): Uint8Array

  // Optional: Biome/feature system
  getBiome(worldX, worldZ): BiomeType
  generateFeature(position: Vector3, feature: FeatureType): void
}
```

**Generation Algorithm Requirements**:
- Must be **surface-only** optimized: iterate XZ plane, compute height(x,z), fill Y column
- Must use **deterministic noise** (Perlin/Simplex with seeded RNG)
- Must handle **chunk boundaries** (height function must be continuous across chunks)
- Must be **fast enough** for real-time generation (target: <16ms per chunk)

**Architectural Decision: Synchronous vs Asynchronous Generation**

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| Synchronous | Simple, no concurrency | Blocks main thread | Phase 1-4 |
| Web Worker | Non-blocking, scalable | Complex message passing, no shared state | Phase 5+ |

**Decision**: Start synchronous with budget constraint (max 2 chunks/frame). Migrate to Web Workers in Phase 5 when world radius exceeds performance targets.

---

### 3.2 Rendering Subsystem

#### Purpose
Translate voxel data into GPU-renderable geometry. Owns all Three.js resources.

#### Responsibilities
1. Generate optimized mesh geometry from chunk data
2. Manage texture atlas and UV mapping
3. Create/update/dispose Three.js objects
4. Apply materials and shaders
5. Coordinate with Three.js render loop

#### Component: MeshBuilder

**Responsibilities**:
1. Read voxel data from VoxelWorld
2. Apply face culling (only render exposed faces)
3. Generate BufferGeometry with proper normals/UVs
4. Return merged geometry for entire chunk

**Critical API Contract**:
```javascript
class MeshBuilder {
  // Generate geometry for a chunk
  buildChunkGeometry(
    world: VoxelWorld,
    chunkX: number,
    chunkY: number,
    chunkZ: number
  ): THREE.BufferGeometry | null

  // Optimization: Update only changed region
  updateRegion(
    geometry: THREE.BufferGeometry,
    region: BoundingBox
  ): void
}
```

**Geometry Generation Strategy**:

```
For each voxel in chunk:
  if voxel is air, skip

  for each face (±X, ±Y, ±Z):
    neighbor = getVoxel(position + face.normal)

    if neighbor is air or transparent:
      add face quad to geometry
      compute UV based on voxel type + face direction
      add normal based on face direction
```

**Optimization Requirements**:
- **Face Culling**: Must check all 6 neighbors (including across chunk boundaries)
- **Geometry Merging**: All chunk faces → single BufferGeometry
- **Indexed Geometry**: Share vertices between faces (6 faces share 8 vertices per cube)
- **Attribute Types**: Use Float32 for positions, Uint16/Float16 for normals, Float32 for UVs

**Performance Constraint**: Geometry generation for 32³ chunk must complete in <10ms (target: 5ms)

**Extension Points**:
- **Greedy Meshing** (Phase 6): Merge coplanar adjacent faces into larger quads
- **Ambient Occlusion**: Add per-vertex lighting based on neighbor configuration
- **LOD**: Generate multiple geometry levels for distant chunks

#### Component: TextureManager

**Responsibilities**:
1. Load texture atlas from image file
2. Provide UV coordinate computation for block types
3. Manage material instances
4. Handle texture settings (filtering, wrapping)

**Critical API Contract**:
```javascript
class TextureManager {
  // Initialize texture system
  loadAtlas(path: string): Promise<void>

  // Get UV coordinates for a face
  getUVForFace(
    blockType: uint8,
    face: 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west',
    corner: 0 | 1 | 2 | 3  // Quad corners
  ): [number, number]

  // Get shared material
  getMaterial(): THREE.Material
}
```

**Texture Atlas Structure** (invariant):
```
Atlas Dimensions: 256×256 or 512×512 pixels
Tile Size: 16×16 pixels per block face
Layout: Grid of [columns × rows]
  - Columns: Block types (0-15 or 0-31)
  - Rows: Face types (0: top, 1: side, 2: bottom)

UV Calculation:
  u = (blockType * tileSize + cornerX * tileSize) / atlasWidth
  v = (faceType * tileSize + cornerY * tileSize) / atlasHeight
```

**Material Configuration**:
```javascript
{
  map: atlasTexture,
  magFilter: THREE.NearestFilter,  // Pixelated aesthetic
  minFilter: THREE.NearestFilter,
  colorSpace: THREE.SRGBColorSpace,
  side: THREE.FrontSide  // Culling enabled for performance
}
```

**Design Constraint**: Single material shared across all chunks to minimize draw calls and state changes.

---

### 3.3 Input Subsystem

#### Purpose
Translate user input into game actions. Manage camera control and player intent.

#### Responsibilities
1. Capture keyboard/mouse events
2. Manage pointer lock for first-person controls
3. Translate input to movement vectors
4. Trigger block interactions (place/destroy)

#### Component: Controls

**Responsibilities**:
1. Integrate Three.js PointerLockControls
2. Update camera position based on WASD input
3. Apply movement constraints (collision, gravity)
4. Expose camera state to other systems

**Critical API Contract**:
```javascript
class Controls {
  // Called every frame with delta time
  update(deltaTime: number): void

  // State queries
  getCameraPosition(): THREE.Vector3
  getCameraDirection(): THREE.Vector3
  getVelocity(): THREE.Vector3

  // State mutations
  applyForce(force: THREE.Vector3): void
  teleport(position: THREE.Vector3): void

  // Lifecycle
  enable(): void
  disable(): void
}
```

**Movement Model**:
```
velocity = acceleration * deltaTime
newPosition = currentPosition + velocity * deltaTime

Physics system validates newPosition
  → If valid, update camera
  → If collision, zero velocity component(s)
```

**Design Decision**: Controls owns camera position, but Physics subsystem has veto power via collision validation.

#### Component: InputHandler

**Responsibilities**:
1. Listen to DOM events (keydown/keyup, mousemove, click)
2. Maintain input state map
3. Route click events to raycaster for block interaction
4. Handle UI events (menu, inventory)

**Critical API Contract**:
```javascript
class InputHandler {
  // Query current input state
  isKeyPressed(key: string): boolean
  getMouseDelta(): { x: number, y: number }

  // Event registration
  onPrimaryAction(callback: () => void): void    // Left click
  onSecondaryAction(callback: () => void): void  // Right click

  // Lifecycle
  attachListeners(element: HTMLElement): void
  detachListeners(): void
}
```

**Event Flow**:
```
DOM Event → InputHandler (filter/normalize) → Controls (movement)
                                            → Raycaster (block interaction)
```

---

### 3.4 Physics Subsystem

#### Purpose
Validate movement and handle collision detection between player and voxel world.

#### Responsibilities
1. Detect collisions between player AABB and voxel grid
2. Apply gravity and ground detection
3. Resolve collisions (prevent penetration)
4. Manage player state (grounded, jumping, falling)

#### Component: Collision

**Critical API Contract**:
```javascript
class Collision {
  // Primary collision check
  checkCollision(
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    boundingBox: AABB
  ): CollisionResult

  // Resolve collision (adjust velocity/position)
  resolveCollision(
    result: CollisionResult,
    position: THREE.Vector3,
    velocity: THREE.Vector3
  ): { position: THREE.Vector3, velocity: THREE.Vector3 }

  // Ground detection
  isGrounded(position: THREE.Vector3, boundingBox: AABB): boolean
}

interface CollisionResult {
  collided: boolean
  normal: THREE.Vector3     // Surface normal of collision
  penetration: number       // How deep into collision
  voxelPosition: [number, number, number]  // Which voxel hit
}
```

**Player Bounding Box** (standard dimensions):
```javascript
{
  width: 0.8,   // X/Z
  height: 1.8,  // Y (eye height ~1.6)
  depth: 0.8
}
```

**Collision Algorithm Requirements**:
1. Must check all voxels intersecting player AABB
2. Must handle collisions on all 3 axes independently (allow sliding)
3. Must prevent floating point drift (snap to grid when grounded)
4. Performance target: <1ms per frame

**Collision Resolution Strategy**:
```
1. Apply gravity to velocity
2. For each axis (Y, X, Z):
     newPosition = position + velocity[axis] * deltaTime
     if checkCollision(newPosition):
       velocity[axis] = 0
       position[axis] = snapToGrid(position[axis])
     else:
       position[axis] = newPosition
```

**Design Constraint**: Physics must query VoxelWorld for collision data but never mutate voxel state.

---

### 3.5 Raycaster Subsystem

#### Purpose
Determine which block the player is looking at and handle block interactions.

#### Responsibilities
1. Cast ray from camera center through voxel grid
2. Find first solid voxel intersection
3. Determine which face was hit (for placement)
4. Validate block placement (no overlap with player)

#### Critical API Contract

```javascript
class Raycaster {
  // Cast ray and find intersection
  cast(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    maxDistance: number
  ): RaycastHit | null

  // Block interaction
  destroyBlock(position: [number, number, number]): void
  placeBlock(
    position: [number, number, number],
    face: FaceDirection,
    blockType: uint8
  ): boolean  // Returns false if placement invalid
}

interface RaycastHit {
  position: [number, number, number]  // Voxel coordinates
  face: 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west'
  distance: number
  blockType: uint8
}
```

**Raycasting Algorithm**:

**Option A: Three.js Raycaster**
- Pros: Built-in, handles mesh intersection
- Cons: Performance degrades with many meshes, not voxel-aware

**Option B: DDA (Digital Differential Analyzer) / Amanatides & Woo**
- Pros: Voxel-optimized, O(distance) complexity, fast
- Cons: Must implement from scratch

**Recommendation**: Implement DDA algorithm for voxel-aware raycasting. Three.js raycaster acceptable for prototype phase if performance is sufficient.

**Block Placement Validation**:
```javascript
function canPlaceBlock(position, playerPosition, playerAABB): boolean {
  // Check 1: Not placing inside player
  if (intersectsAABB(position, playerAABB)) return false

  // Check 2: Adjacent to existing block
  if (!hasAdjacentSolidBlock(position)) return false

  // Check 3: Within world bounds (if applicable)
  if (!isInBounds(position)) return false

  return true
}
```

**Critical Constraint**: Block modifications must trigger chunk regeneration for affected chunks (up to 3 neighbors if on edge).

---

## 4. Cross-Cutting Concerns

### 4.1 State Management

**Authoritative State Ownership**:

| State Type | Owner | Access Pattern |
|------------|-------|----------------|
| Voxel data | VoxelWorld | Read: many, Write: exclusive |
| Chunk meshes | MeshBuilder | Read: Renderer, Write: exclusive |
| Camera position | Controls | Read: many, Write: exclusive |
| Input state | InputHandler | Read: many, Write: exclusive |
| Player velocity | Physics | Read: Controls, Write: exclusive |

**Design Principle**: Each state type has a single owner. Other systems read via API but cannot mutate directly.

### 4.2 Performance Budgets

**Per-Frame Budgets** (60 FPS = 16.67ms frame time):

| Task | Budget | Mitigation Strategy |
|------|--------|---------------------|
| Physics (collision) | 1ms | Spatial hashing for voxel queries |
| Raycasting | 0.5ms | DDA algorithm, cache last result |
| Chunk updates | 5ms | Amortize over multiple frames |
| Rendering | 8ms | LOD, frustum culling, merged geometry |
| Input processing | 0.2ms | Event-driven, not polled |
| Remaining | 2ms | Buffer for GC, browser overhead |

**Memory Budgets**:

| Resource | Budget | Notes |
|----------|--------|-------|
| Voxel data | 32KB/chunk | Uint8Array, 32³ voxels |
| Geometry data | ~100KB/chunk | Varies by surface area |
| Loaded chunks | 100 chunks | ~13MB total (dynamic) |
| Texture atlas | 256KB | 512×512 RGBA |
| Total target | <50MB | Excluding Three.js overhead |

### 4.3 Error Handling

**Critical Errors** (must not crash game):
1. Chunk generation failure → retry with simpler algorithm (flat terrain)
2. Mesh generation failure → render as wireframe bounding box
3. Texture load failure → use solid color fallback
4. localStorage quota exceeded → continue without persistence

**Error Boundaries**:
```javascript
// World subsystem
try {
  world.setVoxel(x, y, z, type)
  chunkManager.markDirty(chunkKey)
} catch (err) {
  console.error('Voxel update failed', err)
  // Rollback not implemented - accept inconsistency
}

// Rendering subsystem
try {
  geometry = meshBuilder.buildChunkGeometry(...)
} catch (err) {
  console.error('Mesh generation failed', err)
  geometry = createErrorGeometry()  // Fallback
}
```

**Invariant Violations**:
- Coordinate out of bounds → clamp to world limits
- Invalid block type → treat as air (0)
- Negative modulo edge case → use Math.floor division

### 4.4 Dependency Management

**Dependency Graph** (arrows show dependencies):

```
               Main
                │
        ┌───────┼───────┐
        ▼       ▼       ▼
     Input   World   Rendering
        │       │       │
        │       ▼       │
        │   ChunkMgr    │
        │       │       │
        └───┐   │   ┏───┘
            ▼   ▼   ▼
          Raycaster
            │   │
            ▼   ▼
          Physics
            │
            ▼
         Collision
```

**Dependency Rules**:
1. No circular dependencies between subsystems
2. World subsystem depends on nothing (core state)
3. Main game loop coordinates subsystems but doesn't implement logic
4. Raycaster depends on World and Physics (read-only)
5. Rendering depends on World (read-only)

**Module Loading Order** (for non-module systems):
```html
<!-- 1. External dependencies -->
<script src="three.min.js"></script>

<!-- 2. Core systems (no dependencies) -->
<script src="world/VoxelWorld.js"></script>
<script src="world/Chunk.js"></script>

<!-- 3. Dependent systems -->
<script src="world/TerrainGenerator.js"></script>
<script src="world/ChunkManager.js"></script>
<script src="rendering/TextureManager.js"></script>
<script src="rendering/MeshBuilder.js"></script>
<script src="physics/Collision.js"></script>

<!-- 4. Integration systems -->
<script src="input/InputHandler.js"></script>
<script src="input/Controls.js"></script>
<script src="utils/Raycaster.js"></script>

<!-- 5. Application entry point -->
<script src="main.js"></script>
```

### 4.5 Testing Strategy

**Unit Testing Targets**:
1. **VoxelWorld**: Coordinate conversions, boundary conditions
2. **ChunkManager**: Load/unload logic, priority queue
3. **Collision**: AABB intersection, edge cases
4. **Raycaster**: DDA algorithm correctness

**Integration Testing**:
1. Block placement at chunk boundaries
2. Player movement across chunks
3. Chunk unload → reload preserves state
4. Raycasting across chunk boundaries

**Performance Testing**:
1. Render 100 chunks and measure FPS
2. Profile mesh generation time per chunk
3. Memory leak detection (play for 10 minutes)
4. Chunk load/unload cycle stability

**Test Data**:
- Flat world (best case performance)
- Extreme terrain (worst case geometry)
- Checkerboard pattern (worst case face culling)

---

## 5. Extension Points & Future Considerations

### 5.1 Block Metadata System

**Current**: Block type is single uint8 (256 types max)

**Future**: Support block state (e.g., furnace direction, chest contents)

**Extension Strategy**:
```javascript
// Option A: Upgrade to Uint16Array (higher byte = metadata)
blockType = data & 0xFF
metadata = (data >> 8) & 0xFF

// Option B: Separate metadata map
metadataMap = new Map<string, BlockMetadata>()  // Key = "x,y,z"
```

**Impact**: Rendering subsystem must handle per-block variation (instancing or dynamic textures)

### 5.2 Lighting System

**Current**: Uniform lighting (ambient + directional)

**Future**: Per-voxel lighting (sunlight + block light)

**Extension Strategy**:
1. Add `Uint8Array` for light levels per voxel (4 bits sun, 4 bits block)
2. Implement light propagation algorithm (flood fill)
3. Update MeshBuilder to apply per-vertex lighting
4. Regenerate lighting when blocks change

**Impact**: Significant complexity increase, performance cost, requires separate pass

### 5.3 Entity System

**Current**: Single player entity (camera + AABB)

**Future**: NPCs, mobs, items, projectiles

**Extension Strategy**:
```javascript
class Entity {
  position: Vector3
  velocity: Vector3
  boundingBox: AABB

  update(deltaTime: number): void
  onCollision(other: Entity): void
}

class EntityManager {
  entities: Map<string, Entity>

  update(deltaTime: number): void
  queryRadius(position: Vector3, radius: number): Entity[]
}
```

**Impact**: Physics subsystem must handle entity-entity collision, not just entity-world

### 5.4 Networking / Multiplayer

**Current**: Single-player only

**Future**: Client-server architecture

**Architectural Changes Required**:
1. **World authority**: Server owns voxel state, clients predict
2. **Replication**: Delta-compressed chunk updates via WebSocket
3. **Client prediction**: Interpolate movement, rollback on correction
4. **Entity synchronization**: Server tick rate vs client framerate

**Impact**: Major refactor - World subsystem becomes thin client proxy, Physics must handle rollback

### 5.5 Modding / Plugin System

**Extension Point**:
```javascript
class GameAPI {
  // Block registration
  registerBlockType(id: uint8, config: BlockConfig): void

  // Event hooks
  onBlockPlace(callback: (position, type) => void): void
  onBlockDestroy(callback: (position, type) => void): void
  onChunkGenerate(callback: (chunk) => void): void

  // World access
  getVoxel(x, y, z): uint8
  setVoxel(x, y, z, type): void
}
```

**Sandboxing**: Mods run in Web Worker with MessagePort API access only

---

## 6. Technical Constraints & Tradeoffs

### 6.1 Pure JavaScript vs Build Toolchain

**Decision**: Pure JS with script tags (ZERO SETUP REQUIREMENT)

| Aspect | Script Tags (Chosen) | ES6 Modules | Webpack/Vite |
|--------|---------------------|-------------|--------------|
| Setup complexity | None - double-click HTML | Requires local server | High |
| Module system | Global namespace / IIFEs | ES6 imports | Full ES6 + npm |
| Dev experience | Browser refresh | Browser refresh | HMR, fast |
| Production | Manual minification | Manual minification | Optimized bundles |
| Dependencies | CDN only | CDN only | Full npm ecosystem |

**Critical Constraint**: MUST work by double-clicking `index.html` - no server, no build step, no npm install.

**Implementation Approach**:
- Use `<script src="">` tags in dependency order (see Section 4.4)
- Three.js loaded via CDN (non-module UMD build)
- Each component uses IIFE pattern: `(function() { window.ComponentName = class {...} })()`
- Or simple global assignments: `class VoxelWorld {...}` at file level

**Tradeoff**: Global namespace pollution vs zero setup. Zero setup is priority for prototype.

### 6.2 Three.js Version

**Decision**: Use latest stable (r160+)

**Rationale**: PointerLockControls API stabilized, better BufferGeometry performance

**Risk**: Breaking changes in future versions require manual updates (no package lock)

### 6.3 Chunk Size Selection

**Options**: 16³ (4,096), 32³ (32,768), 16×16×256 (65,536)

**Decision**: 32³ (32,768 voxels)

**Rationale**:
- 16³ too small → excessive chunk count, more draw calls
- 32³ balanced → 32KB per chunk, reasonable mesh size
- 16×16×256 Minecraft-style → too tall for small prototype, more complex

**Tradeoff**: Larger chunks = slower mesh regeneration but fewer total chunks

### 6.4 Synchronous vs Asynchronous Architecture

**Decision**: Synchronous Phase 1-4, async Phase 5+

**Rationale**:
- Async adds complexity (Promises, Workers, message serialization)
- Synchronous sufficient for small world radius (5-8 chunks)
- Async required when generation time exceeds frame budget

**Migration Path**: TerrainGenerator API remains same, implementation changes

### 6.5 Face Culling vs Greedy Meshing

**Decision**: Face culling Phase 2, greedy meshing Phase 6 (optional)

**Rationale**:
- Face culling: 85% geometry reduction, simple algorithm
- Greedy meshing: 95%+ reduction, complex algorithm, harder to debug
- Diminishing returns for added complexity

**When to migrate**: If profiling shows mesh generation or rendering is bottleneck despite face culling

---

## 7. Development Phases & Milestones

### Phase 1: Foundation (Milestone: "Hello Cube")
**Deliverable**: Three.js scene with camera controls, single test cube

**Validation**:
- ✓ 60 FPS with PointerLockControls
- ✓ Camera moves smoothly with WASD
- ✓ Cube renders with correct lighting

### Phase 2: Voxel World (Milestone: "Single Chunk")
**Deliverable**: VoxelWorld + MeshBuilder rendering 32³ chunk with face culling

**Validation**:
- ✓ Chunk renders with <10ms generation time
- ✓ Face culling reduces faces by 80%+
- ✓ Geometry is merged (single draw call per chunk)

### Phase 3: Interaction (Milestone: "Build & Destroy")
**Deliverable**: Raycaster + block placement/destruction

**Validation**:
- ✓ Can select block by looking at it
- ✓ Left click destroys, right click places
- ✓ Chunk regenerates instantly (<16ms)
- ✓ Can't place block inside player

### Phase 4: World Generation (Milestone: "Textured Terrain")
**Deliverable**: TerrainGenerator + TextureManager + multi-chunk world

**Validation**:
- ✓ 3×3 chunk grid renders at 60 FPS
- ✓ Terrain looks natural with height variation
- ✓ Textures display correctly per block type
- ✓ No seams between chunks

### Phase 5: Infinite World (Milestone: "Exploration")
**Deliverable**: ChunkManager + dynamic loading/unloading

**Validation**:
- ✓ Chunks load ahead of player
- ✓ Chunks unload behind player
- ✓ No frame drops during chunk transitions
- ✓ Memory usage stable over 10 minutes

### Phase 6: Polish (Milestone: "Release Candidate")
**Deliverable**: Greedy meshing, lighting, UI polish

**Validation**:
- ✓ 60 FPS with 50+ loaded chunks
- ✓ <50MB memory usage
- ✓ No visual artifacts or glitches

---

## 8. Handoff to Development Team

### 8.1 Implementation Priorities

**Critical Path** (must not change):
1. VoxelWorld API contract (coordinate system, getVoxel/setVoxel)
2. Chunk data format (Uint8Array, 32³ layout)
3. MeshBuilder output (BufferGeometry with positions, normals, UVs)
4. Texture atlas structure (columns × rows grid)

**Flexible** (developer discretion):
1. Internal algorithm implementations (noise function, DDA vs Three.js raycasting)
2. Class structure within subsystems (can split or combine components)
3. Performance optimizations (spatial hashing, object pooling, etc.)
4. Error handling specifics (logging, fallback strategies)

### 8.2 Key Decisions to Validate

**Before Phase 2**:
1. Confirm chunk size (32³ acceptable or adjust based on profiling?)
2. Confirm face culling implementation is correct (neighbor checks work across chunks?)

**Before Phase 4**:
1. Texture atlas layout finalized (block type order, face assignment)
2. Terrain generation algorithm chosen (which noise library?)

**Before Phase 5**:
1. Chunk loading radius finalized (render vs load vs unload thresholds)
2. Web Worker migration approved (or stay synchronous?)

### 8.3 Review Checkpoints

**Code Review Focus Areas**:
1. **Correctness**: Coordinate conversions, boundary conditions, edge cases
2. **Performance**: Profiling results vs budgets, memory leak testing
3. **Maintainability**: Clear separation of concerns, no circular dependencies
4. **Extensibility**: Can add new block types without refactoring?

**Architecture Review Triggers**:
- Performance budget exceeded by >20%
- Memory usage exceeds 50MB baseline
- Circular dependency introduced
- Major deviation from subsystem responsibilities

### 8.4 Reference Implementation Notes

**Available Resources**:
- Three.js official voxel tutorial: `threejs.org/manual/en/voxel-geometry.html`
- Greedy meshing: `0fps.net/2012/06/30/meshing-in-a-minecraft-game/`
- DDA algorithm: Multiple implementations on GitHub (search "voxel raycast DDA")

**Recommended Study**:
- Minecraft technical wiki: Understanding chunk format, biome generation
- Three.js examples: BufferGeometry manipulation, custom materials

---

## 9. Open Questions & Risks

### 9.1 Open Questions

1. **Persistence**: Use localStorage, IndexedDB, or no persistence?
   - Impact: Determines save/load API design
   - Decision by: Phase 5 start

2. **Lighting**: Defer to Phase 6 or implement earlier?
   - Impact: Affects MeshBuilder geometry generation
   - Decision by: Phase 4 end

3. **Mobile support**: In scope or explicitly out?
   - Impact: Touch controls, performance targets
   - Decision by: Phase 1

### 9.2 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance degrades with chunk count | Medium | High | Profile early, implement LOD if needed |
| Browser memory limits (<100 chunks) | Low | High | Optimize geometry, unload aggressively |
| Three.js breaking changes | Low | Medium | Pin version, test before upgrading |
| Chunk boundary artifacts | Medium | Medium | Thorough testing, neighbor checking |
| Web Worker serialization overhead | Medium | Low | Start synchronous, migrate only if needed |

### 9.3 Non-Technical Risks

- **Scope creep**: Features like redstone, mobs, multiplayer derail timeline
  - Mitigation: Strict phase gating, defer all non-core features

- **Asset licensing**: Unclear Minecraft texture rights
  - Mitigation: Use open-source packs or create original art

---

## 10. Conclusion

This architecture provides a solid foundation for a browser-based voxel game prototype. Key principles:

1. **Modularity**: Clear subsystem boundaries enable parallel development and testing
2. **Incrementality**: Phased approach allows validation at each milestone
3. **Pragmatism**: Start simple (synchronous, face culling), optimize later (async, greedy meshing)
4. **Extensibility**: Extension points identified but not over-engineered

The critical path is: **VoxelWorld → MeshBuilder → Controls → Raycaster → ChunkManager**. Focus on getting core loop working before polish.

**Success Criteria**:
- ✓ 60 FPS with 50+ chunks
- ✓ <50MB memory usage
- ✓ Infinite world exploration
- ✓ Intuitive block building/destruction
- ✓ Clean, maintainable codebase

Questions or need clarification on any architectural decisions? Contact tech lead before implementation.

---

**Appendix: Glossary**

- **AABB**: Axis-Aligned Bounding Box (collision primitive)
- **DDA**: Digital Differential Analyzer (line-drawing algorithm adapted for voxel raycasting)
- **Face Culling**: Removing hidden geometry that's not visible
- **Greedy Meshing**: Algorithm to merge adjacent coplanar faces into larger quads
- **LOD**: Level of Detail (rendering distant objects with less detail)
- **Chunk**: Fixed-size 3D grid of voxels (e.g., 32×32×32)
- **Voxel**: Volumetric pixel - a block in 3D space with a position and type
- **UV Coordinates**: 2D texture coordinates (U=horizontal, V=vertical)
- **BufferGeometry**: Three.js low-level geometry representation (GPU-friendly)
