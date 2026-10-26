import { CONFIG } from './config.js';
import * as input from './input.js';
import { Player } from './player.js';
import { Bullet } from './bullet.js';
import { Formation } from './formation.js';
import { ShieldManager } from './shield.js';
import { GameState } from './game-state.js';
import { checkAABB } from './collision.js';
import * as ui from './ui.js';

/**
 * Główny moduł gry Space Invaders
 */

let canvas;
let ctx;
let lastTime = 0;

// Obiekty gry
const gameState = new GameState();
const player = new Player();
const formation = new Formation();
const shieldManager = new ShieldManager();

let playerBullets = [];
let enemyBullets = [];

/**
 * Inicjalizacja gry po załadowaniu DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    input.init();
    
    // Rozpoczęcie pętli gry
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
});

/**
 * Główna pętla gry
 */
function gameLoop(currentTime) {
    // Obliczanie delta time (dt) w sekundach
    let dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Zabezpieczenie przed dużymi skokami dt (np. po przełączeniu karty)
    dt = Math.min(dt, 0.1);

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
}

/**
 * Aktualizacja logiki gry
 */
function update(dt) {
    const state = gameState.getState();

    // Reakcja na wejście w ekranach menu
    if (state === 'START') {
        if (input.isShootPressed()) {
            startNewGame();
        }
        return;
    }

    if (state === 'GAME_OVER') {
        if (input.isRestartPressed()) {
            startNewGame();
        }
        return;
    }

    if (state === 'WAVE_CLEARED') {
        gameState.waveClearTimer -= dt;
        if (gameState.waveClearTimer <= 0) {
            startNextWave();
        }
        return;
    }

    if (state !== 'PLAYING') return;

    // 1. Ruch gracza
    if (input.isLeftPressed()) {
        player.moveLeft(dt);
    }
    if (input.isRightPressed()) {
        player.moveRight(dt);
    }
    player.update(dt);

    // 2. Strzelanie gracza
    if (input.isShootPressed()) {
        if (playerBullets.length < CONFIG.PLAYER.MAX_BULLETS) {
            const bulletX = player.x + player.width / 2 - CONFIG.BULLET.WIDTH / 2;
            const bulletY = player.y - CONFIG.BULLET.HEIGHT;
            playerBullets.push(new Bullet(bulletX, bulletY, -CONFIG.BULLET.PLAYER_SPEED, true));
        }
    }

    // 3. Aktualizacja formacji i strzelanie wroga
    formation.update(dt, CONFIG.CANVAS.WIDTH);
    const newEnemyBullet = formation.tryShoot(dt);
    if (newEnemyBullet) {
        enemyBullets.push(newEnemyBullet);
    }

    // 4. Aktualizacja pocisków
    playerBullets.forEach(b => b.update(dt));
    enemyBullets.forEach(b => b.update(dt));

    // Usuwanie pocisków poza ekranem
    playerBullets = playerBullets.filter(b => !b.isOutOfBounds(CONFIG.CANVAS.HEIGHT));
    enemyBullets = enemyBullets.filter(b => !b.isOutOfBounds(CONFIG.CANVAS.HEIGHT));

    // 5. Detekcja kolizji
    checkCollisions();

    // 6. Warunki końca fali i gry
    if (formation.isEmpty()) {
        gameState.setState('WAVE_CLEARED');
        gameState.waveClearTimer = 1.5; // Sekundy pauzy
    }

    if (formation.hasInvadersReachedY(player.y)) {
        gameState.triggerInvasionDefeat();
    }
}

/**
 * Zarządzanie kolizjami
 */
function checkCollisions() {
    const activeShields = shieldManager.getShields();
    const aliveInvaders = formation.getAliveInvaders();

    // POCISKI GRACZA
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        const bullet = playerBullets[i];
        let bulletDestroyed = false;

        // vs Najeźdźcy
        for (const invader of aliveInvaders) {
            if (checkAABB(bullet.getBounds(), invader.getBounds())) {
                formation.removeInvader(invader);
                gameState.addScore(CONFIG.INVADERS.POINTS_PER_KILL);
                bulletDestroyed = true;
                break;
            }
        }

        // vs Osłony
        if (!bulletDestroyed) {
            for (const shield of activeShields) {
                if (checkAABB(bullet.getBounds(), shield)) {
                    shieldManager.takeHit(shield);
                    bulletDestroyed = true;
                    break;
                }
            }
        }

        if (bulletDestroyed) {
            playerBullets.splice(i, 1);
        }
    }

    // POCISKI WROGA
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        let bulletDestroyed = false;

        // vs Gracz
        if (checkAABB(bullet.getBounds(), player.getBounds())) {
            if (player.hit()) {
                gameState.loseLife();
            }
            bulletDestroyed = true;
        }

        // vs Osłony
        if (!bulletDestroyed) {
            for (const shield of activeShields) {
                if (checkAABB(bullet.getBounds(), shield)) {
                    shieldManager.takeHit(shield);
                    bulletDestroyed = true;
                    break;
                }
            }
        }

        if (bulletDestroyed) {
            enemyBullets.splice(i, 1);
        }
    }
}

/**
 * Renderowanie wszystkiego na Canvas
 */
function render() {
    // Czyszczenie ekranu
    ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);

    const state = gameState.getState();
    const data = gameState.getData();

    // Renderowanie elementów gry (tylko w określonych stanach)
    if (state === 'PLAYING' || state === 'WAVE_CLEARED' || state === 'GAME_OVER') {
        shieldManager.render(ctx);
        formation.render(ctx);
        player.render(ctx);
        playerBullets.forEach(b => b.render(ctx));
        enemyBullets.forEach(b => b.render(ctx));
        ui.renderHUD(ctx, data);
    }

    // Nakładki UI
    if (state === 'START') {
        ui.renderStartScreen(ctx);
    } else if (state === 'WAVE_CLEARED') {
        ui.renderWaveCleared(ctx, data.wave);
    } else if (state === 'GAME_OVER') {
        ui.renderGameOverScreen(ctx, data);
    }
}

/**
 * Rozpoczęcie nowej, pełnej gry (Wave 1)
 */
function startNewGame() {
    gameState.startNewGame();
    player.reset();
    shieldManager.init();
    formation.init(1);
    playerBullets = [];
    enemyBullets = [];
}

/**
 * Przejście do kolejnej fali
 */
function startNextWave() {
    gameState.nextWave();
    playerBullets = [];
    enemyBullets = [];
    shieldManager.init(); // Odnowienie osłon
    formation.init(gameState.getData().wave);
}
