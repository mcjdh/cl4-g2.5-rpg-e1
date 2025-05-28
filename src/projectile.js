/**
 * Projectile module - handles projectiles and weapon systems
 */
import { COLORS } from './utils.js';
import { CONFIG } from './config.js';

export class Projectile {
    constructor(x, y, directionX, directionY, damage = CONFIG.WEAPON.PROJECTILE_DAMAGE, piercing = false, homing = 0) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.speed = CONFIG.WEAPON.PROJECTILE_SPEED;
        this.damage = damage;
        this.range = CONFIG.WEAPON.PROJECTILE_RANGE;
        this.distanceTraveled = 0;
        this.active = true;
        this.radius = 3;
        this.piercing = piercing;
        this.hitEnemies = new Set(); // Track which enemies this projectile has hit
        this.homing = homing; // Homing strength (0-1)
        this.targetEnemy = null;
    }
      /**
     * Update projectile position and check if it should be removed
     * @param {number} deltaTime - Time elapsed since last frame
     * @param {World} world - World instance for collision detection
     * @param {Array} enemies - Array of enemies for homing behavior
     */
    update(deltaTime, world, enemies = []) {
        if (!this.active) return;
        
        // Homing behavior
        if (this.homing > 0 && enemies.length > 0) {
            // Find nearest enemy if we don't have a target or our target is dead
            if (!this.targetEnemy || !this.targetEnemy.active) {
                this.targetEnemy = this.findNearestEnemy(enemies);
            }
            
            // Adjust direction towards target
            if (this.targetEnemy && this.targetEnemy.active) {
                const dx = this.targetEnemy.x - this.x;
                const dy = this.targetEnemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    const targetDirX = dx / distance;
                    const targetDirY = dy / distance;
                    
                    // Blend current direction with target direction
                    this.directionX = this.directionX * (1 - this.homing) + targetDirX * this.homing;
                    this.directionY = this.directionY * (1 - this.homing) + targetDirY * this.homing;
                    
                    // Normalize direction
                    const dirLength = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);
                    if (dirLength > 0) {
                        this.directionX /= dirLength;
                        this.directionY /= dirLength;
                    }
                }
            }
        }
        
        const moveDistance = this.speed * (deltaTime / 1000);
        
        // Move projectile
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;
        this.distanceTraveled += moveDistance;
        
        // Check if projectile has exceeded its range
        if (this.distanceTraveled >= this.range) {
            this.active = false;
            return;
        }
        
        // Check collision with world (walls)
        if (!world.canMoveTo(this.x, this.y, this.radius * 2, this.radius * 2)) {
            this.active = false;
        }
    }
    
    /**
     * Find the nearest enemy to this projectile
     * @param {Array} enemies - Array of enemies
     * @returns {Enemy|null} Nearest enemy or null
     */
    findNearestEnemy(enemies) {
        let nearest = null;
        let nearestDistance = Infinity;
        
        for (const enemy of enemies) {
            if (!enemy.active) continue;
            
            const distance = Math.sqrt(
                Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2)
            );
            
            if (distance < nearestDistance) {
                nearest = enemy;
                nearestDistance = distance;
            }
        }
        
        return nearest;
    }
      /**
     * Render the projectile
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        if (!this.active) return;
        
        // Choose color based on projectile type
        let color = COLORS.PROJECTILE;
        if (this.piercing) {
            color = COLORS.PROJECTILE_PIERCING;
        } else if (this.homing > 0) {
            color = COLORS.PROJECTILE_HOMING;
        }
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a simple glow effect
        ctx.fillStyle = color + '40'; // Semi-transparent
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add trail effect for homing projectiles
        if (this.homing > 0) {
            ctx.fillStyle = color + '20';
            ctx.beginPath();
            ctx.arc(this.x - this.directionX * 10, this.y - this.directionY * 10, this.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    /**
     * Get projectile bounds for collision detection
     * @returns {Object} Bounds object with x, y, width, height
     */
    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
}

export class WeaponSystem {
    constructor(owner) {
        this.owner = owner;
        this.projectiles = [];
        this.fireRate = CONFIG.WEAPON.FIRE_RATE;
        this.timeSinceLastShot = 0;
        this.autoTargetRange = CONFIG.WEAPON.AUTO_TARGET_RANGE;
        
        // Weapon upgrades (Vampire Survivors style)
        this.level = 1;
        this.multiShotCount = CONFIG.WEAPON.MULTI_SHOT_COUNT;
        this.spreadAngle = CONFIG.WEAPON.SPREAD_ANGLE;
        this.piercing = CONFIG.WEAPON.PIERCING;
        this.homing = CONFIG.WEAPON.HOMING_STRENGTH;
        this.damage = CONFIG.WEAPON.PROJECTILE_DAMAGE;
        
        // Different firing patterns
        this.firingPattern = 'nearest'; // 'nearest', 'spiral', 'spread', 'rotating'
        this.rotationAngle = 0; // For rotating pattern
    }
      /**
     * Update weapon system - handle auto-firing and projectile management
     * @param {number} deltaTime - Time elapsed since last frame
     * @param {World} world - World instance
     * @param {Array} enemies - Array of enemy entities
     */
    update(deltaTime, world, enemies = []) {
        this.timeSinceLastShot += deltaTime / 1000;
        
        // Auto-fire logic
        if (this.timeSinceLastShot >= 1 / this.fireRate) {
            this.fire(enemies);
            this.timeSinceLastShot = 0;
        }
        
        // Update all projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime, world, enemies);
            
            // Remove inactive projectiles
            if (!projectile.active) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update rotation for rotating pattern
        this.rotationAngle += deltaTime / 1000 * 90; // 90 degrees per second
    }
      /**
     * Fire projectiles based on current firing pattern
     * @param {Array} enemies - Array of enemy entities
     */
    fire(enemies = []) {
        const directions = this.calculateFiringDirections(enemies);
        
        for (const direction of directions) {
            const projectile = new Projectile(
                this.owner.x,
                this.owner.y,
                direction.x,
                direction.y,
                this.damage,
                this.piercing,
                this.homing
            );
            
            this.projectiles.push(projectile);
        }
    }
    
    /**
     * Calculate firing directions based on current pattern
     * @param {Array} enemies - Array of enemy entities
     * @returns {Array} Array of direction vectors
     */
    calculateFiringDirections(enemies = []) {
        const directions = [];
        
        switch (this.firingPattern) {
            case 'nearest':
                return this.calculateNearestTargeting(enemies);
            case 'spiral':
                return this.calculateSpiralPattern();
            case 'spread':
                return this.calculateSpreadPattern(enemies);
            case 'rotating':
                return this.calculateRotatingPattern();
            default:
                return this.calculateNearestTargeting(enemies);
        }
    }
    
    /**
     * Calculate directions for nearest enemy targeting
     * @param {Array} enemies - Array of enemy entities
     * @returns {Array} Array of direction vectors
     */
    calculateNearestTargeting(enemies) {
        const directions = [];
        
        // Find multiple nearest enemies for multi-shot
        const targets = this.findNearestEnemies(enemies, this.multiShotCount);
        
        if (targets.length === 0) {
            // No enemies nearby, fire in a spread pattern
            return this.calculateSpreadPattern([]);
        }
        
        for (const target of targets) {
            const dx = target.x - this.owner.x;
            const dy = target.y - this.owner.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                directions.push({
                    x: dx / distance,
                    y: dy / distance
                });
            }
        }
        
        return directions;
    }
    
    /**
     * Calculate directions for spread pattern
     * @param {Array} enemies - Array of enemy entities
     * @returns {Array} Array of direction vectors
     */
    calculateSpreadPattern(enemies) {
        const directions = [];
        let baseAngle = 0;
        
        // If there are enemies, aim towards the nearest one
        if (enemies.length > 0) {
            const nearest = this.findNearestEnemies(enemies, 1)[0];
            if (nearest) {
                baseAngle = Math.atan2(nearest.y - this.owner.y, nearest.x - this.owner.x);
            }
        } else {
            // No enemies, use rotating base angle for visual interest
            baseAngle = this.rotationAngle * Math.PI / 180;
        }
        
        // Create spread pattern
        const angleStep = this.spreadAngle * Math.PI / 180;
        const startAngle = baseAngle - (angleStep * (this.multiShotCount - 1)) / 2;
        
        for (let i = 0; i < this.multiShotCount; i++) {
            const angle = startAngle + (angleStep * i);
            directions.push({
                x: Math.cos(angle),
                y: Math.sin(angle)
            });
        }
        
        return directions;
    }
    
    /**
     * Calculate directions for spiral pattern
     * @returns {Array} Array of direction vectors
     */
    calculateSpiralPattern() {
        const directions = [];
        const baseAngle = this.rotationAngle * Math.PI / 180;
        
        for (let i = 0; i < this.multiShotCount; i++) {
            const angle = baseAngle + (i * 60 * Math.PI / 180); // 60 degrees apart
            directions.push({
                x: Math.cos(angle),
                y: Math.sin(angle)
            });
        }
        
        return directions;
    }
    
    /**
     * Calculate directions for rotating pattern
     * @returns {Array} Array of direction vectors
     */
    calculateRotatingPattern() {
        const directions = [];
        const angleStep = (360 / this.multiShotCount) * Math.PI / 180;
        const baseAngle = this.rotationAngle * Math.PI / 180;
        
        for (let i = 0; i < this.multiShotCount; i++) {
            const angle = baseAngle + (angleStep * i);
            directions.push({
                x: Math.cos(angle),
                y: Math.sin(angle)
            });
        }
        
        return directions;
    }
    
    /**
     * Find the nearest enemies to the owner
     * @param {Array} enemies - Array of enemies
     * @param {number} count - Number of enemies to find
     * @returns {Array} Array of nearest enemies
     */
    findNearestEnemies(enemies, count) {
        const activeEnemies = enemies.filter(e => e.active);
        
        // Calculate distances and sort
        const enemiesWithDistance = activeEnemies.map(enemy => ({
            enemy,
            distance: Math.sqrt(
                Math.pow(enemy.x - this.owner.x, 2) + 
                Math.pow(enemy.y - this.owner.y, 2)
            )
        }));
        
        // Filter by range and sort by distance
        const inRange = enemiesWithDistance.filter(e => e.distance <= this.autoTargetRange);
        inRange.sort((a, b) => a.distance - b.distance);
        
        return inRange.slice(0, count).map(e => e.enemy);
    }
    
    /**
     * Upgrade the weapon system
     * @param {string} upgradeType - Type of upgrade
     */
    upgrade(upgradeType) {
        switch (upgradeType) {
            case 'damage':
                this.damage += 5;
                break;
            case 'fireRate':
                this.fireRate += 0.5;
                break;
            case 'multiShot':
                this.multiShotCount += 1;
                break;
            case 'piercing':
                this.piercing = true;
                break;
            case 'homing':
                this.homing = Math.min(1, this.homing + 0.3);
                break;
            case 'range':
                this.autoTargetRange += 50;
                break;
            case 'pattern':
                // Cycle through firing patterns
                const patterns = ['nearest', 'spread', 'spiral', 'rotating'];
                const currentIndex = patterns.indexOf(this.firingPattern);
                this.firingPattern = patterns[(currentIndex + 1) % patterns.length];
                break;
        }
        
        this.level++;
    }
    
    /**
     * Render all projectiles
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    render(ctx) {
        for (const projectile of this.projectiles) {
            projectile.render(ctx);
        }
    }
    
    /**
     * Get all active projectiles
     * @returns {Array} Array of active projectiles
     */
    getProjectiles() {
        return this.projectiles.filter(p => p.active);
    }
    
    /**
     * Clear all projectiles
     */
    clearProjectiles() {
        this.projectiles = [];
    }
}
