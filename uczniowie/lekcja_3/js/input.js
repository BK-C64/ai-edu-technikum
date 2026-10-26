class InputHandler {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, clicked: false };

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        window.addEventListener('mousemove', (e) => {
            const canvas = document.getElementById('gameCanvas');
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        window.addEventListener('mousedown', (e) => {
            this.mouse.clicked = true;
        });
        window.addEventListener('mouseup', (e) => {
            this.mouse.clicked = false;
        });
    }

    isKeyDown(keyCode) {
        return this.keys[keyCode] || false;
    }
}