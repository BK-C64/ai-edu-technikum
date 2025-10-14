class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0; // Prędkość w osi X
        this.vy = 0; // Prędkość w osi Y
        this.width = BLOCK_SIZE * 0.8;
        this.height = BLOCK_SIZE * 0.9;
        this.onGround = false;
    }

    update(deltaTime, world) {
        // Grawitacja
        this.vy += GRAVITY;
        
        // Kolizje w osi X
        this.x += this.vx;

        // Kolizje w osi Y
        this.y += this.vy;

        // Prosta detekcja kolizji z podłożem
        const gridX = Math.floor((this.x + this.width / 2) / BLOCK_SIZE);
        const gridY = Math.floor((this.y + this.height) / BLOCK_SIZE);

        if (world.getBlock(gridX, gridY)) {
            this.y = gridY * BLOCK_SIZE - this.height;
            this.vy = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }

    move(direction) {
        const speed = 5;
        if (direction === 'left') {
            this.vx = -speed;
        } else if (direction === 'right') {
            this.vx = speed;
        } else {
            this.vx = 0;
        }
    }

    jump() {
        if (this.onGround) {
            this.vy = -12; // Siła skoku
        }
    }
}