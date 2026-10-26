import { CONFIG } from './config.js';

/**
 * Klasa reprezentująca pojedynczego najeźdźcę
 */
export class Invader {
    constructor(gridRow, gridCol, x, y) {
        this.gridRow = gridRow;
        this.gridCol = gridCol;
        this.x = x;
        this.y = y;
        this.width = CONFIG.INVADERS.WIDTH;
        this.height = CONFIG.INVADERS.HEIGHT;
        this.isAlive = true;
    }

    /**
     * Renderowanie najeźdźcy
     */
    render(ctx) {
        if (!this.isAlive) return;

        ctx.fillStyle = CONFIG.COLORS.INVADERS[this.gridRow] || '#ffffff';
        
        // Rysowanie prostego, geometrycznego kształtu obcego
        // Korpus
        ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
        // "Oczy" lub wypustki
        ctx.fillRect(this.x, this.y + 8, 4, 8);
        ctx.fillRect(this.x + this.width - 4, this.y + 8, 4, 8);
        ctx.fillRect(this.x + 8, this.y, 4, 4);
        ctx.fillRect(this.x + this.width - 12, this.y, 4, 4);
        ctx.fillRect(this.x + 8, this.y + this.height - 4, 4, 4);
        ctx.fillRect(this.x + this.width - 12, this.y + this.height - 4, 4, 4);
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
