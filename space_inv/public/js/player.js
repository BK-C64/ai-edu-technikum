import { CONFIG } from './config.js';

/**
 * Klasa reprezentująca statek gracza
 */
export class Player {
    constructor() {
        this.width = CONFIG.PLAYER.WIDTH;
        this.height = CONFIG.PLAYER.HEIGHT;
        this.speed = CONFIG.PLAYER.SPEED;
        this.reset();
    }

    /**
     * Przywraca stan początkowy gracza
     */
    reset() {
        this.x = (CONFIG.CANVAS.WIDTH - this.width) / 2;
        this.y = CONFIG.CANVAS.HEIGHT - CONFIG.PLAYER.Y_OFFSET;
        this.invulnerableTimer = 0;
    }

    /**
     * Poruszanie w lewo
     */
    moveLeft(dt) {
        this.x -= this.speed * dt;
        if (this.x < 0) {
            this.x = 0;
        }
    }

    /**
     * Poruszanie w prawo
     */
    moveRight(dt) {
        this.x += this.speed * dt;
        if (this.x > CONFIG.CANVAS.WIDTH - this.width) {
            this.x = CONFIG.CANVAS.WIDTH - this.width;
        }
    }

    /**
     * Obsługa trafienia
     */
    hit() {
        if (this.invulnerableTimer > 0) {
            return false;
        }
        this.invulnerableTimer = CONFIG.PLAYER.INVULNERABLE_TIME;
        return true;
    }

    /**
     * Aktualizacja stanu
     */
    update(dt) {
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= dt;
        }
    }

    /**
     * Renderowanie statku
     */
    render(ctx) {
        // Efekt migotania przy nietykalności
        if (this.invulnerableTimer > 0) {
            if (Math.floor(Date.now() / 100) % 2 === 0) {
                return;
            }
        }

        ctx.fillStyle = CONFIG.COLORS.PLAYER;
        
        // Rysowanie klasycznego kształtu działa (uproszczone)
        // Podstawa
        ctx.fillRect(this.x, this.y + 8, this.width, 16);
        // Środek
        ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, 4);
        // Lufa
        ctx.fillRect(this.x + (this.width / 2) - 2, this.y, 4, 4);
    }

    /**
     * Zwraca prostokąt kolizyjny
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
