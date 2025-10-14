class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawWorld(world) {
        const colors = {
            'grass': '#2ecc71',
            'dirt': '#95a5a6',
            'stone': '#7f8c8d'
        };

        for (let x = 0; x < world.width; x++) {
            for (let y = 0; y < world.height; y++) {
                const blockType = world.getBlock(x, y);
                if (blockType) {
                    this.ctx.fillStyle = colors[blockType];
                    this.ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }

    drawPlayer(player) {
        this.ctx.fillStyle = 'blue'; // Gracz będzie niebieskim prostokątem
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}