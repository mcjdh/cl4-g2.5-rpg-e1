/**
 * InputHandler module - manages keyboard input and user interactions
 */
export class InputHandler {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }
    
    /**
     * Set up keyboard event listeners
     */
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    /**
     * Update input state (called each frame)
     */
    update() {
        // Keys are automatically updated by event listeners
    }
    
    /**
     * Check if a specific key is currently pressed
     * @param {string} keyCode - The key code to check (e.g., 'KeyW', 'ArrowUp')
     * @returns {boolean} True if the key is pressed
     */
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
    
    /**
     * Check if any movement keys are pressed
     * @returns {boolean} True if any movement key is pressed
     */
    isMoving() {
        return this.isKeyPressed('KeyW') || 
               this.isKeyPressed('KeyS') || 
               this.isKeyPressed('KeyA') || 
               this.isKeyPressed('KeyD') ||
               this.isKeyPressed('ArrowUp') ||
               this.isKeyPressed('ArrowDown') ||
               this.isKeyPressed('ArrowLeft') ||
               this.isKeyPressed('ArrowRight');
    }
    
    /**
     * Get movement direction vector
     * @returns {Object} Object with x and y direction values (-1, 0, or 1)
     */
    getMovementDirection() {
        let x = 0;
        let y = 0;
        
        if (this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft')) {
            x -= 1;
        }
        if (this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight')) {
            x += 1;
        }
        if (this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp')) {
            y -= 1;
        }
        if (this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown')) {
            y += 1;
        }
        
        return { x, y };
    }
}
