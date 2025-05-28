/**
 * Configuration module - centralized game settings and constants
 */

export const CONFIG = {
    // Canvas settings
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    },
    
    // Player settings
    PLAYER: {
        WIDTH: 24,
        HEIGHT: 24,
        SPEED: 150, // pixels per second
        MAX_HEALTH: 100,
        START_X: 400,
        START_Y: 300
    },
    
    // World settings
    WORLD: {
        TILE_SIZE: 32,
        WIDTH_TILES: 50,
        HEIGHT_TILES: 40,
        OBSTACLE_DENSITY: 0.1 // Percentage of random obstacles
    },
    
    // Camera settings
    CAMERA: {
        SMOOTHING: 0.1 // 0 = instant, 1 = no movement
    },
      // Weapon settings
    WEAPON: {
        FIRE_RATE: 2, // Shots per second (increased for more action)
        PROJECTILE_SPEED: 400, // pixels per second
        PROJECTILE_DAMAGE: 20,
        PROJECTILE_RANGE: 250, // pixels
        AUTO_TARGET_RANGE: 200, // Auto-target enemies within this range
        MULTI_SHOT_COUNT: 1, // Number of projectiles per shot
        SPREAD_ANGLE: 15, // Degrees between multi-shot projectiles
        PIERCING: false, // Whether projectiles can hit multiple enemies
        HOMING_STRENGTH: 0 // 0 = no homing, 1 = full homing
    },
      // Enemy settings (for future use with auto-targeting)
    ENEMY: {
        SPAWN_RATE: 3, // enemies per second (increased for more action)
        MAX_ENEMIES: 15,
        SPEED: 60,
        HEALTH: 40,
        SPAWN_DISTANCE_MIN: 150, // Minimum spawn distance from player
        SPAWN_DISTANCE_MAX: 300  // Maximum spawn distance from player
    },
    
    // Experience and progression
    PROGRESSION: {
        XP_PER_ENEMY: 10,
        XP_PER_LEVEL: 50,
        MAX_LEVEL: 10
    },
    
    // Input settings
    INPUT: {
        MOVEMENT_KEYS: {
            UP: ['KeyW', 'ArrowUp'],
            DOWN: ['KeyS', 'ArrowDown'],
            LEFT: ['KeyA', 'ArrowLeft'],
            RIGHT: ['KeyD', 'ArrowRight']
        }
    }
};
