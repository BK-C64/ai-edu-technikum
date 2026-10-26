/**
 * Centralny moduł konfiguracji gry
 */
export const CONFIG = Object.freeze({
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    },
    PLAYER: {
        WIDTH: 48,
        HEIGHT: 24,
        SPEED: 300,
        LIVES: 3,
        INVULNERABLE_TIME: 2.0, // sekundy
        MAX_BULLETS: 3,
        Y_OFFSET: 40 // od dolnej krawędzi
    },
    INVADERS: {
        ROWS: 5,
        COLS: 11,
        WIDTH: 32,
        HEIGHT: 24,
        PADDING_X: 16,
        PADDING_Y: 16,
        START_X: 60,
        START_Y: 80,
        BASE_SPEED_X: 40,
        DROP_Y: 20,
        SPEED_INCREASE_PER_WAVE: 0.10,
        SHOOT_INTERVAL: 1.5, // bazowy czas między strzałami
        POINTS_PER_KILL: 10
    },
    BULLET: {
        WIDTH: 4,
        HEIGHT: 12,
        PLAYER_SPEED: 450,
        ENEMY_SPEED: 250
    },
    SHIELD: {
        COUNT: 4,
        MAX_HEALTH: 3,
        WIDTH: 64,
        HEIGHT: 40,
        Y_POS: 460
    },
    COLORS: {
        BACKGROUND: '#000000',
        PLAYER: '#00ff00',
        BULLET_PLAYER: '#ffffff',
        BULLET_ENEMY: '#ff0000',
        SHIELD_FULL: '#00ff00',
        SHIELD_MEDIUM: '#ffff00',
        SHIELD_LOW: '#ff0000',
        TEXT: '#ffffff',
        INVADERS: [
            '#ff00ff', // rząd 0
            '#ffff00', // rząd 1
            '#ffff00', // rząd 2
            '#00ffff', // rząd 3
            '#00ff00'  // rząd 4
        ]
    }
});
