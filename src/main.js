/**
 * Main Game module - coordinates all game systems and handles the main game loop
 */
import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Camera } from './camera.js';
import { World } from './world.js';
import { EnemyManager } from './enemy.js';
import { CONFIG } from './config.js';

class Game {    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;        
        
        // Game state
        this.camera = new Camera();
        this.player = new Player(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y);
        this.world = new World();
        this.inputHandler = new InputHandler();
        this.enemyManager = new EnemyManager();
          // UI elements
        this.healthElement = document.getElementById('health-value');
        this.positionElement = document.getElementById('position-value');
        this.levelElement = document.getElementById('level-value');
        this.killsElement = document.getElementById('kills-value');
        this.xpElement = document.getElementById('xp-value');
        this.xpRequiredElement = document.getElementById('xp-required');
        this.xpBarElement = document.getElementById('xp-bar');
        this.weaponLevelElement = document.getElementById('weapon-level');
        this.weaponPatternElement = document.getElementById('weapon-pattern');
        
        // Notification system
        this.notifications = [];
        this.notificationTimer = 0;
        
        // Key press tracking for manual controls
        this.patternKeyPressed = false;
        this.upgradeKeyPressed = false;
        
        // Game loop state
        this.lastTime = 0;
        this.gameRunning = false;
        
        this.init();
    }
    
    /**
     * Initialize the game
     */
    init() {
        this.gameRunning = true;
        this.gameLoop();
    }
    
    /**
     * Main game loop
     * @param {number} timestamp - Current timestamp
     */
    gameLoop(timestamp = 0) {
        if (!this.gameRunning) return;
        
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
      /**
     * Update all game systems
     * @param {number} deltaTime - Time elapsed since last frame
     */
    update(deltaTime) {
        // Process input
        this.inputHandler.update();
        
        // Handle manual weapon pattern switching (for testing)
        if (this.inputHandler.isKeyPressed('KeyQ')) {
            if (!this.patternKeyPressed) {
                this.player.weaponSystem.upgrade('pattern');
                this.addNotification(`Pattern changed to: ${this.player.weaponSystem.firingPattern}`, '#9B59B6');
                this.patternKeyPressed = true;
            }
        } else {
            this.patternKeyPressed = false;
        }
        
        // Handle manual upgrades (for testing)
        if (this.inputHandler.isKeyPressed('KeyE')) {
            if (!this.upgradeKeyPressed) {
                this.player.weaponSystem.upgrade('multiShot');
                this.addNotification('Multi-shot upgraded!', '#FFD700');
                this.upgradeKeyPressed = true;
            }
        } else {
            this.upgradeKeyPressed = false;
        }
        
        // Get current enemies for auto-targeting
        const enemies = this.enemyManager.getEnemies();
        
        // Count enemies before update to track kills
        const enemyCountBefore = enemies.length;
        
        // Track player level for notifications
        const previousLevel = this.player.level;
        
        // Update player
        this.player.update(deltaTime, this.inputHandler, this.world, enemies);
        
        // Check for level up
        if (this.player.level > previousLevel) {
            this.addNotification(`Level Up! Now level ${this.player.level}`, '#4CAF50');
            this.addNotification(`Weapon upgraded: ${this.getLastUpgradeType()}`, '#FFD700');
        }
        
        // Update enemies
        this.enemyManager.update(deltaTime, this.player, this.world);
        
        // Check for enemy kills and award experience
        const enemyCountAfter = this.enemyManager.getEnemies().length;
        const enemiesKilled = enemyCountBefore - enemyCountAfter;
        if (enemiesKilled > 0) {
            for (let i = 0; i < enemiesKilled; i++) {
                this.player.addKill();
            }
        }
        
        // Update camera to follow player
        this.camera.follow(this.player, this.width, this.height);
        
        // Update UI
        this.updateUI();
        
        // Update notifications
        this.updateNotifications(deltaTime);
    }
    
    /**
     * Render all game elements
     */
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Save context and apply camera transform
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render world
        this.world.render(this.ctx, this.camera, this.width, this.height);
        
        // Render enemies
        this.enemyManager.render(this.ctx);
        
        // Render player
        this.player.render(this.ctx);
        
        // Restore context
        this.ctx.restore();
        
        // Render notifications on top (no camera transform)
        this.renderNotifications();
    }
    
    /**
     * Render notification messages
     */
    renderNotifications() {
        this.ctx.font = '16px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        
        for (const notification of this.notifications) {
            const alpha = Math.min(1, notification.timer / 1000); // Fade out in last second
            this.ctx.fillStyle = notification.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.fillText(
                notification.message,
                this.width / 2,
                notification.y
            );
        }
        
        this.ctx.textAlign = 'left'; // Reset text alignment
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        this.healthElement.textContent = this.player.health;
        this.positionElement.textContent = `${Math.floor(this.player.x)}, ${Math.floor(this.player.y)}`;
        this.levelElement.textContent = this.player.level;
        this.killsElement.textContent = this.player.killCount;
        this.xpElement.textContent = this.player.experience;
        this.xpRequiredElement.textContent = this.player.level * CONFIG.PROGRESSION.XP_PER_LEVEL;
        this.xpBarElement.style.width = `${this.player.getExperienceProgress() * 100}%`;
        this.weaponLevelElement.textContent = this.player.weaponSystem.level;
        this.weaponPatternElement.textContent = this.player.weaponSystem.firingPattern;
    }
    
    /**
     * Stop the game loop
     */
    stop() {
        this.gameRunning = false;
    }
      /**
     * Restart the game
     */    restart() {
        this.player = new Player(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y);
        this.camera = new Camera();
        this.world = new World();
        this.enemyManager = new EnemyManager();
        this.gameRunning = true;
        this.gameLoop();
    }
    
    /**
     * Add a notification message
     * @param {string} message - Notification message
     * @param {string} color - Notification color
     */
    addNotification(message, color = '#FFFFFF') {
        this.notifications.push({
            message,
            color,
            timer: 3000, // 3 seconds
            y: 50 + this.notifications.length * 25
        });
    }
    
    /**
     * Update notification timers
     * @param {number} deltaTime - Time elapsed
     */
    updateNotifications(deltaTime) {
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            this.notifications[i].timer -= deltaTime;
            if (this.notifications[i].timer <= 0) {
                this.notifications.splice(i, 1);
                // Adjust remaining notification positions
                for (let j = 0; j < this.notifications.length; j++) {
                    this.notifications[j].y = 50 + j * 25;
                }
            }
        }
    }
    
    /**
     * Get the last upgrade type (simplified for demo)
     * @returns {string} Upgrade description
     */
    getLastUpgradeType() {
        const pattern = this.player.weaponSystem.firingPattern;
        const level = this.player.weaponSystem.level;
        return `${pattern} pattern (Level ${level})`;
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
