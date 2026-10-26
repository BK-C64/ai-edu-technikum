import { CONFIG } from './config.js';

/**
 * Moduł renderowania interfejsu użytkownika (HUD i ekrany)
 */

export function renderHUD(ctx, stateData) {
    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = '20px "Courier New", monospace';
    
    // Wynik (lewa)
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${stateData.score}`, 20, 30);
    
    // Fala (środek)
    ctx.textAlign = 'center';
    ctx.fillText(`WAVE: ${stateData.wave}`, CONFIG.CANVAS.WIDTH / 2, 30);
    
    // Życia (prawa)
    ctx.textAlign = 'right';
    ctx.fillText(`LIVES: ${stateData.lives}`, CONFIG.CANVAS.WIDTH - 20, 30);

    // Linia oddzielająca HUD od pola gry
    ctx.strokeStyle = CONFIG.COLORS.PLAYER;
    ctx.beginPath();
    ctx.moveTo(0, 45);
    ctx.lineTo(CONFIG.CANVAS.WIDTH, 45);
    ctx.stroke();
}

export function renderStartScreen(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    
    ctx.fillStyle = CONFIG.COLORS.PLAYER;
    ctx.textAlign = 'center';
    ctx.font = '60px "Courier New", monospace';
    ctx.fillText('SPACE INVADERS', CONFIG.CANVAS.WIDTH / 2, 200);
    
    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = '20px "Courier New", monospace';
    ctx.fillText('A / D lub STRZAŁKI - RUCH', CONFIG.CANVAS.WIDTH / 2, 300);
    ctx.fillText('SPACJA - STRZAŁ', CONFIG.CANVAS.WIDTH / 2, 330);
    
    // Pulsujący tekst
    const pulse = Math.abs(Math.sin(Date.now() / 500));
    ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
    ctx.font = '24px "Courier New", monospace';
    ctx.fillText('NACIŚNIJ SPACJĘ, ABY ROZPOCZĄĆ', CONFIG.CANVAS.WIDTH / 2, 450);
}

export function renderGameOverScreen(ctx, stateData) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    
    ctx.fillStyle = '#ff0000';
    ctx.textAlign = 'center';
    ctx.font = '60px "Courier New", monospace';
    ctx.fillText('GAME OVER', CONFIG.CANVAS.WIDTH / 2, 200);
    
    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = '24px "Courier New", monospace';
    ctx.fillText(stateData.gameOverReason, CONFIG.CANVAS.WIDTH / 2, 260);
    
    ctx.font = '20px "Courier New", monospace';
    ctx.fillText(`TWÓJ WYNIK: ${stateData.score}`, CONFIG.CANVAS.WIDTH / 2, 320);
    ctx.fillText(`OSIĄGNIĘTA FALA: ${stateData.wave}`, CONFIG.CANVAS.WIDTH / 2, 350);
    
    ctx.fillStyle = CONFIG.COLORS.PLAYER;
    ctx.font = '24px "Courier New", monospace';
    ctx.fillText('NACIŚNIJ KLAWISZ "R", ABY ZAGRAĆ PONOWNIE', CONFIG.CANVAS.WIDTH / 2, 450);
}

export function renderWaveCleared(ctx, wave) {
    ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
    ctx.fillRect(0, 0, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT);
    
    ctx.fillStyle = CONFIG.COLORS.PLAYER;
    ctx.textAlign = 'center';
    ctx.font = '40px "Courier New", monospace';
    ctx.fillText(`FALA ${wave} UKOŃCZONA!`, CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2);
    
    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = '20px "Courier New", monospace';
    ctx.fillText('PRZYGOTUJ SIĘ NA NASTĘPNĄ...', CONFIG.CANVAS.WIDTH / 2, CONFIG.CANVAS.HEIGHT / 2 + 50);
}
