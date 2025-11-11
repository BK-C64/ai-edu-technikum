/**
 * InputHandler.js
 *
 * Tracks keyboard and mouse input state.
 * Listens for keydown/keyup events and maintains input state map.
 * Provides query interface for checking if specific keys are pressed.
 * Handles mouse click events for block interaction.
 */

/**
 * InputHandler - Manages keyboard and mouse input
 * Task 1.3.1
 */
class InputHandler {
    constructor() {
        // Track keyboard state for WASD and space
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false
        };

        // Phase 3: Mouse action callbacks (Task 3.2.1)
        this.primaryActionCallback = null;
        this.secondaryActionCallback = null;

        // Bind event listeners
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);

        // Add event listeners
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('contextmenu', this.onContextMenu);

        console.log('InputHandler initialized');
    }

    /**
     * Handle keydown events
     */
    onKeyDown(event) {
        const key = event.key.toLowerCase();

        if (key === 'w' || key === 'arrowup') {
            this.keys.w = true;
        }
        if (key === 'a' || key === 'arrowleft') {
            this.keys.a = true;
        }
        if (key === 's' || key === 'arrowdown') {
            this.keys.s = true;
        }
        if (key === 'd' || key === 'arrowright') {
            this.keys.d = true;
        }
        if (key === ' ') {
            this.keys.space = true;
        }
    }

    /**
     * Handle keyup events
     */
    onKeyUp(event) {
        const key = event.key.toLowerCase();

        if (key === 'w' || key === 'arrowup') {
            this.keys.w = false;
        }
        if (key === 'a' || key === 'arrowleft') {
            this.keys.a = false;
        }
        if (key === 's' || key === 'arrowdown') {
            this.keys.s = false;
        }
        if (key === 'd' || key === 'arrowright') {
            this.keys.d = false;
        }
        if (key === ' ') {
            this.keys.space = false;
        }
    }

    /**
     * Check if a specific key is pressed
     * @param {string} key - Key to check (w, a, s, d, space)
     * @returns {boolean} True if key is currently pressed
     */
    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    /**
     * Handle mouse down events
     * Task 3.2.1
     */
    onMouseDown(event) {
        // Only process if pointer is locked
        if (document.pointerLockElement) {
            if (event.button === 0) {
                // Left click - primary action (destroy block)
                if (this.primaryActionCallback) {
                    this.primaryActionCallback();
                }
            } else if (event.button === 2) {
                // Right click - secondary action (place block)
                if (this.secondaryActionCallback) {
                    this.secondaryActionCallback();
                }
            }
        }
    }

    /**
     * Prevent context menu on right click
     * Task 3.2.1
     */
    onContextMenu(event) {
        if (document.pointerLockElement) {
            event.preventDefault();
        }
    }

    /**
     * Register callback for primary action (left click)
     * Task 3.2.1
     * @param {function} callback - Function to call on left click
     */
    onPrimaryAction(callback) {
        this.primaryActionCallback = callback;
    }

    /**
     * Register callback for secondary action (right click)
     * Task 3.3.1
     * @param {function} callback - Function to call on right click
     */
    onSecondaryAction(callback) {
        this.secondaryActionCallback = callback;
    }

    /**
     * Clean up event listeners
     */
    dispose() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('contextmenu', this.onContextMenu);
    }
}

// Make InputHandler globally available (required for script tag approach)
window.InputHandler = InputHandler;
