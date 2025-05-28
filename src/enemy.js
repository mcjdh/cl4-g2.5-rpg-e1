/**
 * Enemy module - handles enemy entities and AI
 */
import { COLORS } from './utils.js';
import { CONFIG } from './config.js';
import { rectanglesIntersect } from './utils.js';

export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = CONFIG.ENEMY.SPEED;
        this.health = CONFIG.ENEMY.HEALTH;
        this.maxHealth = CONFIG.ENEMY.HEALTH;
        this.active = true;
        
        // Simple AI state
        this.targetX = x;
        this.targetY = y;
        this.retargetTimer = 0;
        this.retargetInterval = 2000; // Retarget every 2 seconds
    }
    
    /**
     * Update enemy AI and movement
     * @param {number} deltaTime - Time elapsed since last frame
     * @param {Player} player - Player instance
     * @param {World} world - World instance
     */
    update(deltaTime, player, world) {
        if (!this.active) return;
        
        this.retargetTimer += deltaTime;
        
        // Simple AI: move towards player with some randomness
        if (this.retargetTimer >= this.retargetInterval) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                // Add some randomness to movement
                const randomOffsetX = (Math.random() - 0.5) * 50;
                const randomOffsetY = (Math.random() - 0.5) * 50;
                
                this.targetX = player.x + randomOffsetX;
                this.targetY = player.y + randomOffsetY;
            }
            
            this.retargetTimer = 0;
        }
        
        // Move towards target
        const moveDistance = this.speed * (deltaTime / 1000);
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) { // Don't move if very close to target
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            const newX = this.x + dirX * moveDistance;
            const newY = this.y + dirY * moveDistance;
            
            // Check collisions
            if (world.canMoveTo(newX, this.y, this.width, this.height)) {
                this.x = newX;
            }
            if (world.canMoveTo(this.x, newY, this.width, this.height)) {
                this.y = newY;
            }
        }
    }
    
    /**
     * Take damage
     * @param {number} damage - Damage amount
     */
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
        }
    }
    
    /**
     * Render the enemy
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        if (!this.active) return;
        
        // Draw enemy body
        ctx.fillStyle = COLORS.ENEMY;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Draw health bar
        const healthBarWidth = this.width;
        const healthBarHeight = 4;
        const healthPercent = this.health / this.maxHealth;
        
        // Health bar background
        ctx.fillStyle = '#333';
        ctx.fillRect(
            this.x - healthBarWidth/2, 
            this.y - this.height/2 - 8, 
            healthBarWidth, 
            healthBarHeight
        );
        
        // Health bar fill
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : '#F44336';
        ctx.fillRect(
            this.x - healthBarWidth/2, 
            this.y - this.height/2 - 8, 
            healthBarWidth * healthPercent, 
            healthBarHeight
        );
    }
    
    /**
     * Get enemy bounds for collision detection
     * @returns {Object} Bounds object
     */
    getBounds() {
        return {
            x: this.x - this.width/2,
            y: this.y - this.height/2,
            width: this.width,
            height: this.height
        };
    }
    
    /**
     * Check collision with projectile
     * @param {Projectile} projectile - Projectile to check against
     * @returns {boolean} True if collision occurred
     */
    checkProjectileCollision(projectile) {
        if (!this.active || !projectile.active) return false;
        
        const enemyBounds = this.getBounds();
        const projectileBounds = projectile.getBounds();
        
        return rectanglesIntersect(enemyBounds, projectileBounds);
    }
}

export class EnemyManager {
    constructor() {
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnRate = CONFIG.ENEMY.SPAWN_RATE;
        this.maxEnemies = CONFIG.ENEMY.MAX_ENEMIES;
    }
    
    /**
     * Update all enemies and handle spawning
     * @param {number} deltaTime - Time elapsed since last frame
     * @param {Player} player - Player instance
     * @param {World} world - World instance
     */
    update(deltaTime, player, world) {
        this.spawnTimer += deltaTime;
        
        // Spawn new enemies
        if (this.spawnTimer >= 1000 / this.spawnRate && this.enemies.length < this.maxEnemies) {
            this.spawnEnemy(player, world);
            this.spawnTimer = 0;
        }
        
        // Update existing enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime, player, world);
            
            // Remove dead enemies
            if (!enemy.active) {
                this.enemies.splice(i, 1);
            }
        }
        
        // Handle projectile collisions
        this.handleProjectileCollisions(player.weaponSystem.getProjectiles());
    }
      /**
     * Spawn a new enemy at a safe distance from the player
     * @param {Player} player - Player instance
     * @param {World} world - World instance
     */
    spawnEnemy(player, world) {
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts) {
            // Spawn enemies outside the screen but not too far
            const angle = Math.random() * Math.PI * 2;
            const distance = CONFIG.ENEMY.SPAWN_DISTANCE_MIN + 
                            Math.random() * (CONFIG.ENEMY.SPAWN_DISTANCE_MAX - CONFIG.ENEMY.SPAWN_DISTANCE_MIN);
            
            const x = player.x + Math.cos(angle) * distance;
            const y = player.y + Math.sin(angle) * distance;
            
            // Check if spawn position is valid
            if (world.canMoveTo(x, y, 20, 20)) {
                this.enemies.push(new Enemy(x, y));
                break;
            }
            
            attempts++;
        }
    }
      /**
     * Handle collisions between projectiles and enemies
     * @param {Array} projectiles - Array of projectiles
     */
    handleProjectileCollisions(projectiles) {
        for (const projectile of projectiles) {
            if (!projectile.active) continue;
            
            for (const enemy of this.enemies) {
                if (!enemy.active) continue;
                
                // Skip if this projectile already hit this enemy
                if (projectile.hitEnemies.has(enemy)) continue;
                
                if (enemy.checkProjectileCollision(projectile)) {
                    enemy.takeDamage(projectile.damage);
                    projectile.hitEnemies.add(enemy);
                    
                    // If projectile doesn't pierce, deactivate it
                    if (!projectile.piercing) {
                        projectile.active = false;
                        break;
                    }
                }
            }
        }
    }
    
    /**
     * Render all enemies
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }
    }
    
    /**
     * Get all active enemies
     * @returns {Array} Array of active enemies
     */
    getEnemies() {
        return this.enemies.filter(e => e.active);
    }
    
    /**
     * Clear all enemies
     */
    clearEnemies() {
        this.enemies = [];
    }
}
