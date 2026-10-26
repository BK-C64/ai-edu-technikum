import { CONFIG } from './config.js';

/**
 * Klasa reprezentująca pocisk (gracza lub wroga)
 */
export class Bullet {
    constructor(x, y, vy, isPlayerBullet) {
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.isPlayerBullet = isPlayerBullet;
        this.width = CONFIG.BULLET.WIDTH;
        this.height = CONFIG.BULLET.HEIGHT;
    }

    /**
     * Aktualizacja pozycji pocisku
     */
    update(dt) {
        this.y += this.vy * dt;
    }

    /**
     * Sprawdzenie czy pocisk wyleciał poza ekran
     */
    isOutOfBounds(canvasHeight) {
        if (this.isPlayerBullet) {
            return (this.y + this.height < 0);
        } else {
            return (this.y > canvasHeight);
        }
    }

    /**
     * Renderowanie pocisku
     */
    render(ctx) {
        ctx.fillStyle = this.isPlayerBullet ? CONFIG.COLORS.BULLET_PLAYER : CONFIG.COLORS.BULLET_ENEMY;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
