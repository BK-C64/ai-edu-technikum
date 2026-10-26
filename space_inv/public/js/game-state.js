import { CONFIG } from './config.js';

/**
 * Moduł zarządzania stanem gry
 */
export class GameState {
    constructor() {
        this.reset();
    }

    /**
     * Całkowity reset gry
     */
    reset() {
        this.state = 'START'; // 'START', 'PLAYING', 'WAVE_CLEARED', 'GAME_OVER'
        this.score = 0;
        this.lives = CONFIG.PLAYER.LIVES;
        this.wave = 1;
        this.gameOverReason = '';
        this.waveClearTimer = 0;
    }

    /**
     * Rozpoczęcie nowej rozgrywki
     */
    startNewGame() {
        this.reset();
        this.state = 'PLAYING';
    }

    /**
     * Dodanie punktów
     */
    addScore(points) {
        this.score += points;
        return this.score;
    }

    /**
     * Utrata życia
     */
    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.lives = 0;
            this.setState('GAME_OVER');
            this.gameOverReason = 'Wszystkie życia utracone!';
        }
    }

    /**
     * Przegrana przez inwazję (dotarcie do ziemi)
     */
    triggerInvasionDefeat() {
        this.setState('GAME_OVER');
        this.gameOverReason = 'Najeźdźcy dotarli na Ziemię!';
    }

    /**
     * Przejście do następnej fali
     */
    nextWave() {
        this.wave++;
        this.state = 'PLAYING';
    }

    setState(newState) {
        this.state = newState;
    }

    getState() {
        return this.state;
    }

    /**
     * Zwraca dane stanu do UI
     */
    getData() {
        return {
            score: this.score,
            lives: this.lives,
            wave: this.wave,
            state: this.state,
            gameOverReason: this.gameOverReason
        };
    }
}
