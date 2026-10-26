/**
 * Moduł obsługi wejścia (klawiatury)
 */

const keys = {
    left: false,
    right: false,
    shoot: false,
    restart: false
};

// Mechanizm konsumpcji dla spacji (strzału)
let shootProcessed = false;

export function init() {
    window.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            keys.left = true;
            e.preventDefault();
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            keys.right = true;
            e.preventDefault();
        }
        if (e.code === 'Space') {
            if (!shootProcessed) {
                keys.shoot = true;
                shootProcessed = true;
            }
            e.preventDefault();
        }
        if (e.code === 'KeyR') {
            keys.restart = true;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            keys.left = false;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            keys.right = false;
        }
        if (e.code === 'Space') {
            keys.shoot = false;
            shootProcessed = false;
        }
        if (e.code === 'KeyR') {
            keys.restart = false;
        }
    });
}

export function isLeftPressed() {
    return keys.left;
}

export function isRightPressed() {
    return keys.right;
}

export function isShootPressed() {
    if (keys.shoot) {
        keys.shoot = false; // Konsumujemy wciśnięcie
        return true;
    }
    return false;
}

export function isRestartPressed() {
    return keys.restart;
}
