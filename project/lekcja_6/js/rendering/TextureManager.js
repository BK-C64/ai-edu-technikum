/**
 * TextureManager.js
 *
 * Manages texture atlas loading and UV coordinate calculation.
 * Provides UV mapping for different block types and face orientations.
 * Handles material creation and texture configuration.
 * Configures texture filtering for pixelated aesthetic.
 */

/**
 * TextureManager - Manages block textures and UV mapping
 * Updated for procedural texture atlas
 */
class TextureManager {
    /**
     * Constructor
     */
    constructor() {
        // Texture atlas parameters
        this.atlasSize = 256;
        this.tileSize = 16;
        this.tilesPerRow = 16;
        this.tileUVSize = 1 / this.tilesPerRow;  // 0.0625

        // Block type to texture tile mapping
        // Format: { blockType: { top: tileIndex, side: tileIndex, bottom: tileIndex } }
        this.blockTextures = {
            0: { top: -1, side: -1, bottom: -1 },  // Air (no texture)
            1: { top: 0, side: 1, bottom: 2 },     // Grass (green top, grass side, dirt bottom)
            2: { top: 2, side: 2, bottom: 2 },     // Dirt (all sides same)
            3: { top: 3, side: 3, bottom: 3 },     // Stone
            4: { top: 6, side: 7, bottom: 6 },     // Wood (rings on top/bottom, bark on sides)
            5: { top: 4, side: 4, bottom: 4 },     // Sand
            6: { top: 8, side: 8, bottom: 8 },     // Leaves
            7: { top: 11, side: 11, bottom: 11 },  // Planks
            8: { top: 9, side: 9, bottom: 9 },     // Glass
            9: { top: 10, side: 10, bottom: 10 },  // Cobblestone
            10: { top: 5, side: 5, bottom: 5 },    // Bedrock
        };

        // Texture atlas and material
        this.atlas = null;
        this.material = null;

        console.log('TextureManager initialized (procedural texture mode)');
    }

    /**
     * Load procedural texture atlas
     * @returns {Promise} Promise that resolves when texture is loaded
     */
    async loadAtlas() {
        console.log('TextureManager: Generating procedural texture atlas...');

        return new Promise((resolve) => {
            // Create atlas generator
            const generator = new TextureAtlasGenerator(this.tileSize, this.tilesPerRow);

            // Generate atlas
            generator.generateAtlas();

            // Get THREE.js texture
            this.atlas = generator.getTexture();

            // Debug: Verify texture properties
            console.log('TextureManager: Texture properties:', {
                width: this.atlas.image.width,
                height: this.atlas.image.height,
                magFilter: this.atlas.magFilter,
                minFilter: this.atlas.minFilter,
                encoding: this.atlas.encoding
            });

            // Create shared material with texture
            this.material = new THREE.MeshLambertMaterial({
                map: this.atlas,
                flatShading: false,
                side: THREE.DoubleSide, // Use DoubleSide to prevent culling issues
                fog: true, // Enable fog support (VISUAL_IMPROVEMENTS_PLAN.md - Task 2.1.2)
            });

            // Force texture update
            this.atlas.needsUpdate = true;

            console.log('TextureManager: Texture atlas loaded successfully');
            console.log('TextureManager: Material properties:', {
                hasMap: this.material.map !== null,
                mapType: this.material.map ? this.material.map.constructor.name : 'null',
                materialType: this.material.type
            });
            resolve();
        });
    }

    /**
     * Get material for rendering (shared material with texture)
     * @returns {THREE.Material} Material with texture atlas
     */
    getMaterial() {
        return this.material;
    }

    /**
     * Get UV coordinates for a face corner
     * @param {number} blockType - Block type ID
     * @param {string} faceDirection - Face direction (top, bottom, side)
     * @param {number} corner - Corner index (0-3)
     * @returns {Array} [u, v] coordinates
     */
    getUVForFace(blockType, faceDirection, corner) {
        // Get texture tile index based on face direction
        const textures = this.blockTextures[blockType] || this.blockTextures[0];

        let tileIndex;
        if (faceDirection === 'top') {
            tileIndex = textures.top;
        } else if (faceDirection === 'bottom') {
            tileIndex = textures.bottom;
        } else {
            tileIndex = textures.side;
        }

        // If no valid texture, return default UV
        if (tileIndex < 0) {
            return [0, 0];
        }

        // Calculate tile position in atlas
        const tileX = tileIndex % this.tilesPerRow;
        const tileY = Math.floor(tileIndex / this.tilesPerRow);

        // Calculate UV coordinates for this corner
        // Corner mapping: 0=bottom-left, 1=bottom-right, 2=top-right, 3=top-left
        // With flipY=false (canvas default), UV (0,0) corresponds to canvas (0,0) which is top-left
        const uvOffsets = [
            [0, 1],  // bottom-left in 3D space = (left, bottom)
            [1, 1],  // bottom-right in 3D space = (right, bottom)
            [1, 0],  // top-right in 3D space = (right, top)
            [0, 0]   // top-left in 3D space = (left, top)
        ];

        const [offsetX, offsetY] = uvOffsets[corner] || [0, 0];

        const u = (tileX + offsetX) * this.tileUVSize;
        const v = (tileY + offsetY) * this.tileUVSize;

        // Debug: Log first UV calculation
        if (!this._uvLogged) {
            console.log(`First UV calculation: block=${blockType}, face=${faceDirection}, corner=${corner}, tile=${tileIndex}, UV=(${u.toFixed(4)}, ${v.toFixed(4)})`);
            this._uvLogged = true;
        }

        return [u, v];
    }
}

// Make TextureManager globally available
window.TextureManager = TextureManager;
