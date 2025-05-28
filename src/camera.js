/**
 * Camera module - handles camera positioning and following logic
 */
import { CONFIG } from './config.js';

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.smoothing = CONFIG.CAMERA.SMOOTHING; // Camera smoothing factor (0 = instant, 1 = no movement)
    }
    
    /**
     * Make camera follow a target entity
     * @param {Object} target - Target entity with x, y properties
     * @param {number} screenWidth - Screen width
     * @param {number} screenHeight - Screen height
     */
    follow(target, screenWidth, screenHeight) {
        // Calculate desired camera position (centered on target)
        const targetX = target.x - screenWidth / 2;
        const targetY = target.y - screenHeight / 2;
        
        // Apply smooth following
        this.x = this.x + (targetX - this.x) * this.smoothing;
        this.y = this.y + (targetY - this.y) * this.smoothing;
    }
    
    /**
     * Set camera position instantly (no smoothing)
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Get camera bounds for culling calculations
     * @param {number} screenWidth - Screen width
     * @param {number} screenHeight - Screen height
     * @returns {Object} Object with left, right, top, bottom bounds
     */
    getBounds(screenWidth, screenHeight) {
        return {
            left: this.x,
            right: this.x + screenWidth,
            top: this.y,
            bottom: this.y + screenHeight
        };
    }
    
    /**
     * Convert world coordinates to screen coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} Object with x, y screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }
    
    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {Object} Object with x, y world coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
}
