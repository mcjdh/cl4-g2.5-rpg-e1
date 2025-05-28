/**
 * World module - handles world generation, collision detection, and rendering
 */
import { TILE_TYPES, COLORS } from './utils.js';
import { CONFIG } from './config.js';
export class World {    constructor() {
        this.tileSize = CONFIG.WORLD.TILE_SIZE;
        this.width = CONFIG.WORLD.WIDTH_TILES; // tiles
        this.height = CONFIG.WORLD.HEIGHT_TILES; // tiles
        
        // Generate a simple world with some obstacles
        this.tiles = this.generateWorld();
    }
    
    /**
     * Generate the world tiles
     * @returns {Array<Array<number>>} 2D array of tile types
     */
    generateWorld() {
        const tiles = [];
        
        for (let y = 0; y < this.height; y++) {
            tiles[y] = [];            for (let x = 0; x < this.width; x++) {
                // Create borders
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    tiles[y][x] = TILE_TYPES.WALL; // Wall
                }                // Add some random obstacles
                else if (Math.random() < CONFIG.WORLD.OBSTACLE_DENSITY) {
                    tiles[y][x] = TILE_TYPES.WALL; // Wall
                } else {
                    tiles[y][x] = TILE_TYPES.FLOOR; // Floor
                }
            }
        }
        
        return tiles;
    }
    
    /**
     * Check if an entity can move to the given position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Entity width
     * @param {number} height - Entity height
     * @returns {boolean} True if the position is valid
     */
    canMoveTo(x, y, width, height) {
        // Check if the given rectangle can be placed at the position
        const left = Math.floor((x - width/2) / this.tileSize);
        const right = Math.floor((x + width/2) / this.tileSize);
        const top = Math.floor((y - height/2) / this.tileSize);
        const bottom = Math.floor((y + height/2) / this.tileSize);
        
        // Check bounds
        if (left < 0 || right >= this.width || top < 0 || bottom >= this.height) {
            return false;
        }
          // Check for solid tiles
        for (let ty = top; ty <= bottom; ty++) {
            for (let tx = left; tx <= right; tx++) {
                if (this.tiles[ty][tx] === TILE_TYPES.WALL) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Get tile type at world coordinates
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @returns {number} Tile type (0 = floor, 1 = wall)
     */
    getTileAt(x, y) {
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
          if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
            return TILE_TYPES.WALL; // Out of bounds = wall
        }
        
        return this.tiles[tileY][tileX];
    }
    
    /**
     * Get world dimensions in pixels
     * @returns {Object} Object with width and height in pixels
     */
    getWorldSize() {
        return {
            width: this.width * this.tileSize,
            height: this.height * this.tileSize
        };
    }
    
    /**
     * Render the world
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {Camera} camera - Camera instance
     * @param {number} screenWidth - Screen width
     * @param {number} screenHeight - Screen height
     */
    render(ctx, camera, screenWidth, screenHeight) {
        // Calculate visible tile range for culling
        const startX = Math.max(0, Math.floor(camera.x / this.tileSize));
        const endX = Math.min(this.width - 1, Math.floor((camera.x + screenWidth) / this.tileSize));
        const startY = Math.max(0, Math.floor(camera.y / this.tileSize));
        const endY = Math.min(this.height - 1, Math.floor((camera.y + screenHeight) / this.tileSize));
        
        // Render visible tiles
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tileType = this.tiles[y][x];
                const tileX = x * this.tileSize;
                const tileY = y * this.tileSize;
                  // Choose color based on tile type
                if (tileType === TILE_TYPES.FLOOR) {
                    // Floor tile
                    ctx.fillStyle = COLORS.FLOOR;
                } else {
                    // Wall tile
                    ctx.fillStyle = COLORS.WALL;
                }
                
                ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);
                
                // Add subtle grid lines for visual clarity
                ctx.strokeStyle = COLORS.GRID;
                ctx.lineWidth = 1;
                ctx.strokeRect(tileX, tileY, this.tileSize, this.tileSize);
            }
        }
    }
}
