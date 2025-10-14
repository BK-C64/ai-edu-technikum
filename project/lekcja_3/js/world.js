class World {
    constructor() {
        this.grid = [];
        this.width = CANVAS_WIDTH / BLOCK_SIZE;
        this.height = CANVAS_HEIGHT / BLOCK_SIZE;
    }

    generateWorld() {
        for (let x = 0; x < this.width; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.height; y++) {
                if (y > this.height * 0.7) {
                    this.grid[x][y] = 'stone'; // Kamień
                } else if (y > this.height * 0.6) {
                    this.grid[x][y] = 'dirt'; // Ziemia
                } else if (y === Math.floor(this.height * 0.6)) {
                    this.grid[x][y] = 'grass'; // Trawa
                } else {
                    this.grid[x][y] = null; // Powietrze
                }
            }   
        }
    }

    getBlock(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.grid[x][y];
        }
        return null;
    }

    setBlock(x, y, type) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[x][y] = type;
        }
    }

    removeBlock(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[x][y] = null; // Ustawia blok na powietrze
        }
    }
}