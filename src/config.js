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
