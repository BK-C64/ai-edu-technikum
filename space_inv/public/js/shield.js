import { CONFIG } from './config.js';

/**
 * Moduł zarządzania osłonami (bunkrami)
 */
export class ShieldManager {
    constructor() {
        this.shields = [];
    }

    /**
     * Inicjalizacja osłon
     */
    init() {
        this.shields = [];
        const spacing = CONFIG.CANVAS.WIDTH / (CONFIG.SHIELD.COUNT + 1);
        
        for (let i = 0; i < CONFIG.SHIELD.COUNT; i++) {
            this.shields.push({
                id: i,
                x: spacing * (i + 1) - CONFIG.SHIELD.WIDTH / 2,
                y: CONFIG.SHIELD.Y_POS,
                width: CONFIG.SHIELD.WIDTH,
                height: CONFIG.SHIELD.HEIGHT,
                health: CONFIG.SHIELD.MAX_HEALTH,
                isDestroyed: false
            });
        }
    }

    /**
     * Obsługa trafienia w osłonę
     */
    takeHit(shield) {
        shield.health--;
        if (shield.health <= 0) {
            shield.isDestroyed = true;
        }
    }

    /**
     * Pobranie tylko aktywnych osłon
     */
    getShields() {
        return this.shields.filter(s => !s.isDestroyed);
    }

    /**
     * Renderowanie osłon
     */
    render(ctx) {
        for (const shield of this.getShields()) {
            if (shield.health === 3) {
                ctx.fillStyle = CONFIG.COLORS.SHIELD_FULL;
            } else if (shield.health === 2) {
                ctx.fillStyle = CONFIG.COLORS.SHIELD_MEDIUM;
            } else {
                ctx.fillStyle = CONFIG.COLORS.SHIELD_LOW;
            }
            
            // Rysowanie bunkra (uproszczony kształt trapezu/bloku)
            ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
            
            // "Wycinanie" wejścia w bunkrze
            ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
            ctx.fillRect(shield.x + 16, shield.y + 24, shield.width - 32, 16);
        }
    }
}
