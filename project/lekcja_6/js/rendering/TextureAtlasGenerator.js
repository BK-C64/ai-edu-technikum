/**
 * TextureAtlasGenerator.js
 *
 * Generates a procedural texture atlas with gradients and patterns.
 * Creates visually interesting textures programmatically using Canvas API.
 */

class TextureAtlasGenerator {
    constructor(tileSize = 16, tilesPerRow = 16) {
        this.tileSize = tileSize;
        this.tilesPerRow = tilesPerRow;
        this.atlasSize = tileSize * tilesPerRow;

        // Create canvas for drawing
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.atlasSize;
        this.canvas.height = this.atlasSize;
        this.ctx = this.canvas.getContext('2d');

        console.log(`TextureAtlasGenerator: Creating ${this.atlasSize}x${this.atlasSize} atlas`);
    }

    /**
     * Generate the complete texture atlas
     */
    generateAtlas() {
        // Clear canvas to white
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.atlasSize, this.atlasSize);

        // Generate textures for each tile
        this.drawGrassTop(0);        // Tile 0: Grass top (green with variations)
        this.drawGrassSide(1);       // Tile 1: Grass side (green top, brown bottom)
        this.drawDirt(2);            // Tile 2: Dirt (brown with darker spots)
        this.drawStone(3);           // Tile 3: Stone (gray with cracks)
        this.drawSand(4);            // Tile 4: Sand (tan with variation)
        this.drawBedrock(5);         // Tile 5: Bedrock (very dark, mottled)
        this.drawWoodTop(6);         // Tile 6: Wood top (rings)
        this.drawWoodSide(7);        // Tile 7: Wood side (vertical lines)
        this.drawLeaves(8);          // Tile 8: Leaves (dark green, patchy)
        this.drawGlass(9);           // Tile 9: Glass (light blue, transparent)
        this.drawCobblestone(10);    // Tile 10: Cobblestone (varied gray stones)
        this.drawPlanks(11);         // Tile 11: Planks (horizontal lines)

        console.log('TextureAtlasGenerator: Atlas generation complete');
        return this.canvas;
    }

    /**
     * Get tile position in pixels
     */
    getTilePos(tileIndex) {
        const x = (tileIndex % this.tilesPerRow) * this.tileSize;
        const y = Math.floor(tileIndex / this.tilesPerRow) * this.tileSize;
        return { x, y };
    }

    /**
     * Fill tile with color and add noise
     */
    fillWithNoise(tileIndex, baseColor, noiseAmount = 15) {
        const pos = this.getTilePos(tileIndex);
        const imageData = this.ctx.createImageData(this.tileSize, this.tileSize);
        const data = imageData.data;

        // Parse base color
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);

        for (let y = 0; y < this.tileSize; y++) {
            for (let x = 0; x < this.tileSize; x++) {
                const i = (y * this.tileSize + x) * 4;
                const noise = (Math.random() - 0.5) * noiseAmount;

                data[i] = Math.max(0, Math.min(255, r + noise));
                data[i + 1] = Math.max(0, Math.min(255, g + noise));
                data[i + 2] = Math.max(0, Math.min(255, b + noise));
                data[i + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, pos.x, pos.y);
    }

    /**
     * Grass Top - Green with darker spots
     */
    drawGrassTop(tileIndex) {
        this.fillWithNoise(tileIndex, '#5FA359', 20);

        const pos = this.getTilePos(tileIndex);
        // Add some darker grass blade marks
        for (let i = 0; i < 8; i++) {
            const x = pos.x + Math.random() * this.tileSize;
            const y = pos.y + Math.random() * this.tileSize;
            this.ctx.fillStyle = 'rgba(45, 80, 45, 0.3)';
            this.ctx.fillRect(x, y, 1, 2);
        }
    }

    /**
     * Grass Side - Green top with brown bottom
     */
    drawGrassSide(tileIndex) {
        const pos = this.getTilePos(tileIndex);

        // Brown bottom (dirt)
        const gradient = this.ctx.createLinearGradient(0, pos.y, 0, pos.y + this.tileSize);
        gradient.addColorStop(0, '#5FA359');
        gradient.addColorStop(0.25, '#5FA359');
        gradient.addColorStop(0.3, '#8B6F47');
        gradient.addColorStop(1, '#6B4423');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(pos.x, pos.y, this.tileSize, this.tileSize);

        // Add noise
        this.addNoise(pos.x, pos.y, this.tileSize, this.tileSize, 15);
    }

    /**
     * Dirt - Brown with variations
     */
    drawDirt(tileIndex) {
        this.fillWithNoise(tileIndex, '#8B6F47', 25);

        const pos = this.getTilePos(tileIndex);
        // Add darker spots (rocks/pebbles)
        for (let i = 0; i < 6; i++) {
            const x = pos.x + Math.random() * this.tileSize;
            const y = pos.y + Math.random() * this.tileSize;
            const size = 1 + Math.random() * 2;
            this.ctx.fillStyle = 'rgba(60, 40, 20, 0.4)';
            this.ctx.fillRect(x, y, size, size);
        }
    }

    /**
     * Stone - Gray with cracks
     */
    drawStone(tileIndex) {
        this.fillWithNoise(tileIndex, '#888888', 20);

        const pos = this.getTilePos(tileIndex);
        // Add some crack lines
        this.ctx.strokeStyle = 'rgba(50, 50, 50, 0.3)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x + Math.random() * this.tileSize, pos.y + Math.random() * this.tileSize);
            this.ctx.lineTo(pos.x + Math.random() * this.tileSize, pos.y + Math.random() * this.tileSize);
            this.ctx.stroke();
        }
    }

    /**
     * Sand - Tan with subtle variation
     */
    drawSand(tileIndex) {
        this.fillWithNoise(tileIndex, '#E4C89A', 15);
    }

    /**
     * Bedrock - Very dark, mottled
     */
    drawBedrock(tileIndex) {
        this.fillWithNoise(tileIndex, '#2A2A2A', 30);

        const pos = this.getTilePos(tileIndex);
        // Add lighter spots
        for (let i = 0; i < 8; i++) {
            const x = pos.x + Math.random() * this.tileSize;
            const y = pos.y + Math.random() * this.tileSize;
            this.ctx.fillStyle = 'rgba(80, 80, 80, 0.3)';
            this.ctx.fillRect(x, y, 1, 1);
        }
    }

    /**
     * Wood Top - Rings pattern
     */
    drawWoodTop(tileIndex) {
        const pos = this.getTilePos(tileIndex);
        const centerX = pos.x + this.tileSize / 2;
        const centerY = pos.y + this.tileSize / 2;

        // Draw concentric circles
        for (let r = 2; r < this.tileSize / 2; r += 2) {
            this.ctx.strokeStyle = r % 4 === 0 ? '#6B4423' : '#8B6F47';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        this.addNoise(pos.x, pos.y, this.tileSize, this.tileSize, 10);
    }

    /**
     * Wood Side - Vertical grain
     */
    drawWoodSide(tileIndex) {
        const pos = this.getTilePos(tileIndex);

        // Vertical gradient
        const gradient = this.ctx.createLinearGradient(pos.x, 0, pos.x + this.tileSize, 0);
        gradient.addColorStop(0, '#8B6F47');
        gradient.addColorStop(0.5, '#A0825A');
        gradient.addColorStop(1, '#8B6F47');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(pos.x, pos.y, this.tileSize, this.tileSize);

        // Vertical lines
        for (let x = 0; x < this.tileSize; x += 2) {
            this.ctx.strokeStyle = 'rgba(100, 70, 40, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x + x, pos.y);
            this.ctx.lineTo(pos.x + x, pos.y + this.tileSize);
            this.ctx.stroke();
        }
    }

    /**
     * Leaves - Dark green, patchy
     */
    drawLeaves(tileIndex) {
        this.fillWithNoise(tileIndex, '#2D5016', 25);

        const pos = this.getTilePos(tileIndex);
        // Add lighter green spots (leaf variations)
        for (let i = 0; i < 10; i++) {
            const x = pos.x + Math.random() * this.tileSize;
            const y = pos.y + Math.random() * this.tileSize;
            this.ctx.fillStyle = 'rgba(80, 120, 40, 0.3)';
            this.ctx.fillRect(x, y, 2, 2);
        }
    }

    /**
     * Glass - Light blue, translucent looking
     */
    drawGlass(tileIndex) {
        const pos = this.getTilePos(tileIndex);

        // Light blue with gradient
        const gradient = this.ctx.createRadialGradient(
            pos.x + this.tileSize / 2, pos.y + this.tileSize / 2, 0,
            pos.x + this.tileSize / 2, pos.y + this.tileSize / 2, this.tileSize
        );
        gradient.addColorStop(0, '#C5E8F7');
        gradient.addColorStop(1, '#87CEEB');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(pos.x, pos.y, this.tileSize, this.tileSize);
    }

    /**
     * Cobblestone - Varied gray stones
     */
    drawCobblestone(tileIndex) {
        const pos = this.getTilePos(tileIndex);

        // Draw random stone shapes
        for (let i = 0; i < 9; i++) {
            const x = pos.x + (i % 3) * (this.tileSize / 3);
            const y = pos.y + Math.floor(i / 3) * (this.tileSize / 3);
            const gray = 100 + Math.random() * 60;
            this.ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
            this.ctx.fillRect(x, y, this.tileSize / 3, this.tileSize / 3);

            // Stone borders
            this.ctx.strokeStyle = 'rgba(40, 40, 40, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, this.tileSize / 3, this.tileSize / 3);
        }
    }

    /**
     * Planks - Horizontal wooden planks
     */
    drawPlanks(tileIndex) {
        const pos = this.getTilePos(tileIndex);
        const plankHeight = this.tileSize / 4;

        // Draw 4 horizontal planks
        for (let i = 0; i < 4; i++) {
            const y = pos.y + i * plankHeight;
            const brown = i % 2 === 0 ? '#A0825A' : '#8B6F47';
            this.ctx.fillStyle = brown;
            this.ctx.fillRect(pos.x, y, this.tileSize, plankHeight);

            // Plank border
            this.ctx.strokeStyle = 'rgba(60, 40, 20, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(pos.x, y, this.tileSize, plankHeight);
        }

        this.addNoise(pos.x, pos.y, this.tileSize, this.tileSize, 10);
    }

    /**
     * Helper: Add noise to region
     */
    addNoise(x, y, width, height, amount) {
        const imageData = this.ctx.getImageData(x, y, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * amount;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }

        this.ctx.putImageData(imageData, x, y);
    }

    /**
     * Get THREE.js texture from canvas
     */
    getTexture() {
        const texture = new THREE.CanvasTexture(this.canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        // Set color encoding (try both property names for compatibility)
        if (THREE.sRGBEncoding !== undefined) {
            texture.encoding = THREE.sRGBEncoding;
            console.log('TextureAtlasGenerator: Using texture.encoding = sRGBEncoding');
        } else if (THREE.SRGBColorSpace !== undefined) {
            texture.colorSpace = THREE.SRGBColorSpace;
            console.log('TextureAtlasGenerator: Using texture.colorSpace = SRGBColorSpace');
        }

        // Set flipY to false for canvas textures (canvas Y goes down, WebGL V goes up)
        texture.flipY = false;
        texture.needsUpdate = true;

        // Debug: Check if canvas has colors by sampling a pixel
        const ctx = this.canvas.getContext('2d');
        const sampleData = ctx.getImageData(8, 8, 1, 1).data; // Sample grass tile center
        console.log('TextureAtlasGenerator: Sample pixel from grass tile (8,8):',
            `RGB(${sampleData[0]}, ${sampleData[1]}, ${sampleData[2]})`);

        console.log('TextureAtlasGenerator: THREE.js texture created');

        // Debug: Offer to download texture atlas as PNG
        if (window.DEBUG_TEXTURES) {
            console.log('DEBUG_TEXTURES enabled - canvas can be downloaded');
            window.downloadTextureAtlas = () => {
                const link = document.createElement('a');
                link.download = 'texture-atlas.png';
                link.href = this.canvas.toDataURL();
                link.click();
                console.log('Texture atlas downloaded as texture-atlas.png');
            };
            console.log('Run window.downloadTextureAtlas() to download the texture atlas');
        }

        return texture;
    }
}

// Make globally available
window.TextureAtlasGenerator = TextureAtlasGenerator;
