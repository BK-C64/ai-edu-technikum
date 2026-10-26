# Visual Improvements Plan - "Polish & Atmosphere"

**Goal**: Enhance visual quality and atmosphere without adding gameplay features
**Estimated Time**: 3-4 hours
**Current State**: Functional game with color-coded blocks, needs visual polish

---

## Overview

The game works smoothly with all mechanics functioning. Now we focus exclusively on making it look better:
- Real textures instead of solid colors
- Atmospheric effects (fog, sky gradient)
- Better lighting and shadows
- Visual polish (AO, better materials)

---

## Task Breakdown

### 1. Texture Atlas (Priority: HIGH)

**Goal**: Replace solid colors with actual Minecraft block textures

#### 1.1 Download Textures
- [ ] **1.1.1** Research texture sources
  - Option A: mcasset.cloud (official Minecraft textures)
  - Option B: Faithful texture pack (higher res, open source)
  - Option C: OpenGameArt.org (CC0 licensed alternatives)
  - **Decision**: Use Faithful 32x32 pack (open source, better quality)

- [ ] **1.1.2** Download required textures (10-12 block types)
  - Grass block (top, side, bottom)
  - Dirt
  - Stone
  - Sand
  - Bedrock
  - Wood log (top, side)
  - Leaves
  - Glass (semi-transparent)
  - Cobblestone
  - **Download to**: `assets/textures/blocks/`

- [ ] **1.1.3** Create texture atlas
  - Use image editor or script to combine textures
  - Layout: 16×16 grid (256×256 pixels with 16×16 textures)
  - Row-based layout: [grass_top, grass_side, dirt, stone, sand, ...]
  - Save as: `assets/textures/atlas.png`
  - Document UV coordinates in TextureManager

#### 1.2 Update TextureManager
- [ ] **1.2.1** Implement real texture loading
  - Update `loadAtlas()` to actually load PNG file
  - Configure THREE.TextureLoader
  - Set NearestFilter for pixelated look
  - Handle loading errors gracefully

- [ ] **1.2.2** Implement UV calculation
  - Update `getUVForFace()` with real atlas coordinates
  - Handle different faces (grass top vs side)
  - Map block types to texture positions
  - **Formula**: u = (tileX / atlasWidth), v = (tileY / atlasHeight)

- [ ] **1.2.3** Update material creation
  - Switch from `vertexColors` to texture `map`
  - Keep MeshLambertMaterial for lighting
  - Configure texture filtering (NearestFilter)
  - Set colorSpace to SRGBColorSpace

#### 1.3 Update MeshBuilder
- [ ] **1.3.1** Generate proper UVs per face
  - Call TextureManager.getUVForFace() for each corner
  - Pass block type and face direction
  - Handle grass blocks (different top/side/bottom)
  - Remove vertex color generation

- [ ] **1.3.2** Test texture rendering
  - Verify textures appear correctly
  - Check for UV seams or wrapping issues
  - Validate grass blocks show grass on top, dirt on sides

**Acceptance Criteria**:
- ✓ Blocks show actual textures instead of solid colors
- ✓ Grass blocks have green top, brown/green sides
- ✓ Textures are pixelated (not blurry)
- ✓ No UV seams or artifacts
- ✓ Performance maintained (60 FPS)

---

### 2. Atmospheric Fog (Priority: HIGH)

**Goal**: Add distance fog for atmosphere and hide far terrain

#### 2.1 Implement Fog
- [ ] **2.1.1** Add fog to scene
  - Use THREE.Fog or THREE.FogExp2
  - Configure fog color (light blue/white for daytime)
  - Set near/far distances (near: 32, far: 80)
  - Match fog color to sky background

- [ ] **2.1.2** Update materials for fog
  - Ensure all materials have `fog: true`
  - Test fog rendering with terrain
  - Adjust fog density for best look

- [ ] **2.1.3** Make fog configurable
  - Add fog toggle in code (easy to turn on/off)
  - Document fog parameters
  - **Parameters**: color, near, far

**Acceptance Criteria**:
- ✓ Distant terrain fades into fog
- ✓ Fog color matches sky
- ✓ No performance impact
- ✓ Smooth fade (not abrupt cutoff)

---

### 3. Improved Sky/Lighting (Priority: MEDIUM)

**Goal**: Better sky and lighting for more atmosphere

#### 3.1 Sky Improvements
- [ ] **3.1.1** Add sky gradient (optional)
  - Consider THREE.SkyBox or gradient background
  - Simple option: Keep current sky blue (0x87CEEB)
  - Advanced option: Vertex-based sky gradient
  - **Decision**: Keep simple sky blue for now

- [ ] **3.1.2** Add sun visualization (optional)
  - Draw sun sprite or distant bright sphere
  - Position based on directional light direction
  - **Decision**: Defer to future (not essential)

#### 3.2 Lighting Improvements
- [ ] **3.2.1** Tune ambient/directional light ratio
  - Current: ambient 0.6, directional 0.8
  - Experiment with ratios for better contrast
  - Goal: Surfaces should show clear light/shadow
  - **Suggested**: ambient 0.4, directional 1.0

- [ ] **3.2.2** Adjust light position/color
  - Current position: (5, 10, 7.5)
  - Consider warmer light color (0xffffee)
  - Test different sun angles

- [ ] **3.2.3** Consider shadows (OPTIONAL - may hurt performance)
  - THREE.js shadow mapping is expensive
  - Requires renderer.shadowMap.enabled = true
  - Requires light.castShadow = true
  - **Decision**: Skip shadows for performance

**Acceptance Criteria**:
- ✓ Sky looks pleasant (blue or gradient)
- ✓ Lighting provides good contrast
- ✓ Surfaces clearly lit/shaded
- ✓ 60 FPS maintained

---

### 4. Material & Visual Polish (Priority: LOW)

**Goal**: Small touches to improve overall look

#### 4.1 Material Improvements
- [ ] **4.1.1** Switch back to FrontSide culling
  - Currently using DoubleSide (debug mode)
  - Change to THREE.FrontSide for performance
  - Verify face winding is correct (CCW)

- [ ] **4.1.2** Consider MeshStandardMaterial (optional)
  - More realistic than MeshLambertMaterial
  - Supports roughness/metalness
  - May impact performance - test first
  - **Decision**: Only if performance allows

- [ ] **4.1.3** Add slight AO or shading variation (optional)
  - Darken vertices in corners for ambient occlusion
  - Simple technique: multiply vertex brightness by factor
  - **Decision**: Defer to future (complex)

#### 4.2 Visual Tweaks
- [ ] **4.2.1** Adjust camera FOV
  - Current: 75 degrees
  - Minecraft default: 70 degrees
  - Test different values (60-80)

- [ ] **4.2.2** Add vignette or post-processing (optional)
  - Simple CSS vignette overlay
  - Or THREE.js EffectComposer
  - **Decision**: Keep simple, no post-processing

- [ ] **4.2.3** Improve crosshair
  - Current: CSS-based cross
  - Make smaller or different color
  - Add slight transparency

**Acceptance Criteria**:
- ✓ Materials use efficient rendering (FrontSide)
- ✓ Overall look is polished
- ✓ 60 FPS maintained

---

### 5. UI Polish (Priority: LOW)

**Goal**: Better user interface and instructions

#### 5.1 Start Screen
- [ ] **5.1.1** Add simple start screen overlay
  - "Click to start" message
  - Controls reminder (WASD, Space, Mouse)
  - Visible before pointer lock

- [ ] **5.1.2** Style improvements
  - Update CSS for better fonts
  - Add subtle styling to crosshair
  - Consider dark corners/vignette

#### 5.2 In-Game HUD (optional)
- [ ] **5.2.1** FPS counter (optional)
  - Display in corner for debugging
  - Use stats.js or custom counter
  - **Decision**: Optional, not essential

**Acceptance Criteria**:
- ✓ Users see clear instructions before playing
- ✓ UI is minimal and non-intrusive

---

## Implementation Order (Recommended)

1. **Textures** (1.5-2 hours) - Biggest visual impact
   - Download and create atlas
   - Update TextureManager
   - Update MeshBuilder
   - Test and verify

2. **Fog** (30 minutes) - Easy atmospheric improvement
   - Add THREE.Fog
   - Configure parameters
   - Test appearance

3. **Lighting** (30 minutes) - Quick tuning
   - Adjust light ratios
   - Test different values
   - Find best settings

4. **Polish** (30-60 minutes) - Final touches
   - Switch to FrontSide
   - Adjust crosshair
   - Add start screen
   - Final testing

**Total Time**: ~3-4 hours

---

## Technical Notes

### Texture Atlas Structure

```
Layout (256×256 px, 16×16 tiles):
Row 0: grass_top, grass_side, dirt, stone, sand, bedrock, ...
Row 1: wood_top, wood_side, leaves, glass, cobblestone, ...
...

UV Calculation:
- Each tile is 16×16 px in 256×256 atlas
- Tile size in UV space: 1/16 = 0.0625
- For tile at position (tx, ty):
  - uMin = tx * 0.0625
  - vMin = ty * 0.0625
  - uMax = (tx + 1) * 0.0625
  - vMax = (ty + 1) * 0.0625
```

### Fog Configuration

```javascript
// Linear fog (simple)
scene.fog = new THREE.Fog(
    0x87CEEB,  // color (match sky)
    32,        // near (start fading)
    96         // far (fully fogged)
);

// Exponential fog (more realistic)
scene.fog = new THREE.FogExp2(
    0x87CEEB,  // color
    0.02       // density (adjust to taste)
);
```

### Texture Filtering

```javascript
texture.magFilter = THREE.NearestFilter;  // Pixelated when zoomed in
texture.minFilter = THREE.NearestFilter;  // Pixelated when far away
texture.colorSpace = THREE.SRGBColorSpace; // Correct colors
texture.wrapS = THREE.RepeatWrapping;      // Tile textures
texture.wrapT = THREE.RepeatWrapping;
```

---

## Resource Links

**Texture Sources**:
- Faithful 32x32: https://faithfulpack.net/
- MCAsset: https://mcasset.cloud/
- OpenGameArt: https://opengameart.org/

**Three.js Docs**:
- Fog: https://threejs.org/docs/#api/en/scenes/Fog
- TextureLoader: https://threejs.org/docs/#api/en/loaders/TextureLoader
- Materials: https://threejs.org/docs/#api/en/materials/Material

---

## Acceptance Criteria - Visual Improvements Complete

| Feature | Target | Status |
|---------|--------|--------|
| Texture Atlas | Working | ⬜ |
| Blocks Show Textures | Yes | ⬜ |
| Grass Top/Side Different | Yes | ⬜ |
| Textures Pixelated | Yes | ⬜ |
| Atmospheric Fog | Working | ⬜ |
| Fog Matches Sky | Yes | ⬜ |
| Improved Lighting | Tuned | ⬜ |
| FrontSide Culling | Yes | ⬜ |
| 60 FPS Maintained | Yes | ⬜ |
| No Visual Bugs | Yes | ⬜ |

---

## Notes

- Focus on visual quality, not new features
- Keep performance at 60 FPS (top priority)
- Use existing Three.js capabilities (no new libraries)
- Textures must be open source or properly licensed
- Test in browser after each major change

**Next Steps**: Start with Task 1.1 (Download Textures)
