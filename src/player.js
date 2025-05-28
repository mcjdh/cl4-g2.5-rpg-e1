/**
 * Player module - handles player entity, movement, and rendering
 */
import { COLORS } from './utils.js';
import { CONFIG } from './config.js';
import { WeaponSystem } from './projectile.js';
export class Player {    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.PLAYER.WIDTH;
        this.height = CONFIG.PLAYER.HEIGHT;
        this.speed = CONFIG.PLAYER.SPEED; // pixels per second
        this.health = CONFIG.PLAYER.MAX_HEALTH;
        this.maxHealth = CONFIG.PLAYER.MAX_HEALTH;
        
        // Experience and progression
        this.experience = 0;
        this.level = 1;
        this.killCount = 0;
        
        // Add weapon system
        this.weaponSystem = new WeaponSystem(this);
    }
      /**
     * Update player state based on input and world constraints
     * @param {number} deltaTime - Time elapsed since last frame
     * @param {InputHandler} inputHandler - Input handler instance
     * @param {World} world - World instance for collision detection
     * @param {Array} enemies - Array of enemy entities (for auto-targeting)
     */
    update(deltaTime, inputHandler, world, enemies = []) {
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
        
        // Update weapon system
        this.weaponSystem.update(deltaTime, world, enemies);
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
        
        // Render weapon projectiles
        this.weaponSystem.render(ctx);
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
     * Gain experience and handle level ups
     * @param {number} amount - Experience amount
     */
    gainExperience(amount) {
        this.experience += amount;
        const requiredXP = this.level * CONFIG.PROGRESSION.XP_PER_LEVEL;
        
        if (this.experience >= requiredXP && this.level < CONFIG.PROGRESSION.MAX_LEVEL) {
            this.levelUp();
        }
    }
    
    /**
     * Level up and upgrade weapon
     */
    levelUp() {
        this.level++;
        this.experience = 0; // Reset experience for next level
        
        // Auto-upgrade weapon based on level
        const upgradeTypes = ['damage', 'fireRate', 'multiShot', 'range', 'homing', 'piercing', 'pattern'];
        const upgradeType = upgradeTypes[Math.floor(Math.random() * upgradeTypes.length)];
        this.weaponSystem.upgrade(upgradeType);
        
        // Restore some health on level up
        this.heal(20);
    }
    
    /**
     * Increment kill count and gain experience
     */
    addKill() {
        this.killCount++;
        this.gainExperience(CONFIG.PROGRESSION.XP_PER_ENEMY);
    }    /**    /**
     * Get experience progress as percentage
     * @returns {number} Progress percentage (0-1)
     */
    getExperienceProgress() {
        const requiredXP = this.level * CONFIG.PROGRESSION.XP_PER_LEVEL;
        return Math.min(1, this.experience / requiredXP);
    }
    
    /**
     * Check if player is alive
     * @returns {boolean} True if player health > 0
     */
    isAlive() {
        return this.health > 0;
    }
}
