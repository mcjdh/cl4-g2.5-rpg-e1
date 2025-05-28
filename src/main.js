/**
 * Main Game module - coordinates all game systems and handles the main game loop
 */
import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Camera } from './camera.js';
import { World } from './world.js';
import { CONFIG } from './config.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
          // Game state
        this.camera = new Camera();
        this.player = new Player(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y);
        this.world = new World();
        this.inputHandler = new InputHandler();
        
        // UI elements
        this.healthElement = document.getElementById('health-value');
        this.positionElement = document.getElementById('position-value');
        
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
        
        // Update player
        this.player.update(deltaTime, this.inputHandler, this.world);
        
        // Update camera to follow player
        this.camera.follow(this.player, this.width, this.height);
        
        // Update UI
        this.updateUI();
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
        
        // Render player
        this.player.render(this.ctx);
        
        // Restore context
        this.ctx.restore();
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        this.healthElement.textContent = this.player.health;
        this.positionElement.textContent = `${Math.floor(this.player.x)}, ${Math.floor(this.player.y)}`;
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
        this.gameRunning = true;
        this.gameLoop();
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
