import { CONFIG } from './config.js';
import { Invader } from './invader.js';
import { Bullet } from './bullet.js';

/**
 * Zarządzanie całą formacją najeźdźców
 */
export class Formation {
    constructor() {
        this.invaders = [];
        this.direction = 1; // 1: prawo, -1: lewo
        this.speedX = 0;
        this.baseSpeedX = 0;
        this.shootTimer = 0;
        this.totalInvaders = 0;
    }

    /**
     * Inicjalizacja formacji dla danej fali
     */
    init(wave) {
        this.invaders = [];
        this.direction = 1;
        this.shootTimer = 0;
        
        // Obliczanie prędkości bazowej fali
        this.baseSpeedX = CONFIG.INVADERS.BASE_SPEED_X * (1 + CONFIG.INVADERS.SPEED_INCREASE_PER_WAVE * (wave - 1));
        this.speedX = this.baseSpeedX;

        for (let row = 0; row < CONFIG.INVADERS.ROWS; row++) {
            for (let col = 0; col < CONFIG.INVADERS.COLS; col++) {
                const x = CONFIG.INVADERS.START_X + col * (CONFIG.INVADERS.WIDTH + CONFIG.INVADERS.PADDING_X);
                const y = CONFIG.INVADERS.START_Y + row * (CONFIG.INVADERS.HEIGHT + CONFIG.INVADERS.PADDING_Y);
                this.invaders.push(new Invader(row, col, x, y));
            }
        }
        this.totalInvaders = this.invaders.length;
    }

    /**
     * Aktualizacja ruchu formacji
     */
    update(dt, canvasWidth) {
        let reachedEdge = false;
        const aliveInvaders = this.getAliveInvaders();

        // Ruch w poziomie
        for (const invader of aliveInvaders) {
            invader.x += this.speedX * this.direction * dt;
            
            // Sprawdzenie krawędzi
            if (this.direction === 1 && invader.x + invader.width >= canvasWidth) {
                reachedEdge = true;
            } else if (this.direction === -1 && invader.x <= 0) {
                reachedEdge = true;
            }
        }

        // Jeśli dotknięto krawędzi - zmiana kierunku i zejście w dół
        if (reachedEdge) {
            this.direction *= -1;
            for (const invader of aliveInvaders) {
                invader.y += CONFIG.INVADERS.DROP_Y;
            }
        }
    }

    /**
     * Logika oddawania strzału przez wrogów
     */
    tryShoot(dt) {
        this.shootTimer += dt;
        if (this.shootTimer >= CONFIG.INVADERS.SHOOT_INTERVAL) {
            // Reset timera z lekkim losowym odchyleniem
            this.shootTimer = Math.random() * 0.5; 
            
            const bottomInvaders = this.getBottomInvaders();
            if (bottomInvaders.length > 0) {
                const shooter = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];
                return new Bullet(
                    shooter.x + shooter.width / 2 - CONFIG.BULLET.WIDTH / 2,
                    shooter.y + shooter.height,
                    CONFIG.BULLET.ENEMY_SPEED,
                    false
                );
            }
        }
        return null;
    }

    /**
     * Znajduje najniższych żywych najeźdźców w każdej kolumnie
     */
    getBottomInvaders() {
        const bottomMost = {};
        for (const invader of this.getAliveInvaders()) {
            if (!bottomMost[invader.gridCol] || invader.gridRow > bottomMost[invader.gridCol].gridRow) {
                bottomMost[invader.gridCol] = invader;
            }
        }
        return Object.values(bottomMost);
    }

    /**
     * Usuwa (zabija) najeźdźcę i przyspiesza formację
     */
    removeInvader(invader) {
        invader.isAlive = false;
        const aliveCount = this.getAliveInvaders().length;
        if (aliveCount > 0) {
            // Przyspieszenie: im mniej wrogów, tym szybciej się ruszają
            this.speedX = this.baseSpeedX * (1 + (this.totalInvaders - aliveCount) / this.totalInvaders);
        }
    }

    /**
     * Sprawdza czy najeźdźcy dotarli do określonej wysokości (np. poziomu gracza)
     */
    hasInvadersReachedY(targetY) {
        return this.getAliveInvaders().some(inv => inv.y + inv.height >= targetY);
    }

    getAliveInvaders() {
        return this.invaders.filter(inv => inv.isAlive);
    }

    isEmpty() {
        return this.getAliveInvaders().length === 0;
    }

    render(ctx) {
        for (const invader of this.getAliveInvaders()) {
            invader.render(ctx);
        }
    }
}
