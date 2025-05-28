/**
 * Player module - handles player entity, movement, and rendering
 */
import { COLORS } from './utils.js';
import { CONFIG } from './config.js';
export class Player {    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER.WIDTH;
        this.height = CONFIG.PLAYER.HEIGHT;
        this.speed = CONFIG.PLAYER.SPEED; // pixels per second
        this.health = CONFIG.PLAYER.MAX_HEALTH;
        this.maxHealth = CONFIG.PLAYER.MAX_HEALTH;
    }
    
    /**
     * Update player state based on input and world constraints
     * @param {number} deltaTime - Time elapsed since last frame
     * @param {InputHandler} inputHandler - Input handler instance
     * @param {World} world - World instance for collision detection
     */
    update(deltaTime, inputHandler, world) {
        const moveDistance = this.speed * (deltaTime / 1000);
        let newX = this.x;
        let newY = this.y;
        
        // Handle movement input
        if (inputHandler.isKeyPressed('KeyW') || inputHandler.isKeyPressed('ArrowUp')) {
            newY -= moveDistance;
        }
        if (inputHandler.isKeyPressed('KeyS') || inputHandler.isKeyPressed('ArrowDown')) {
            newY += moveDistance;
        }
        if (inputHandler.isKeyPressed('KeyA') || inputHandler.isKeyPressed('ArrowLeft')) {
            newX -= moveDistance;
        }
        if (inputHandler.isKeyPressed('KeyD') || inputHandler.isKeyPressed('ArrowRight')) {
            newX += moveDistance;
        }
        
        // Check collision with world bounds and obstacles
        if (world.canMoveTo(newX, this.y, this.width, this.height)) {
            this.x = newX;
        }
        if (world.canMoveTo(this.x, newY, this.width, this.height)) {
            this.y = newY;
        }
    }
    
    /**
     * Render the player on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */    render(ctx) {
        // Draw player as a simple blue rectangle
        ctx.fillStyle = COLORS.PLAYER;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Draw a simple face
        ctx.fillStyle = COLORS.UI_TEXT;
        ctx.fillRect(this.x - 6, this.y - 6, 3, 3); // Left eye
        ctx.fillRect(this.x + 3, this.y - 6, 3, 3); // Right eye
        ctx.fillRect(this.x - 3, this.y + 2, 6, 2); // Mouth
    }
    
    /**
     * Take damage and handle health changes
     * @param {number} amount - Damage amount
     */
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }
    
    /**
     * Heal the player
     * @param {number} amount - Heal amount
     */
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    /**
     * Check if player is alive
     * @returns {boolean} True if player health > 0
     */
    isAlive() {
        return this.health > 0;
    }
}
