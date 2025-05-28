# Minimalist RPG

A simple 2D top-down RPG built with vanilla JavaScript using ES6 modules for scalability and maintainability.

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with dedicated modules
- **Player Movement**: WASD or arrow key controls
- **Collision Detection**: World boundary and obstacle collision
- **Camera System**: Smooth camera following with configurable smoothing
- **Tile-based World**: Procedurally generated world with configurable parameters
- **Real-time UI**: Health and position display

## 📁 Project Structure

```
src/
├── main.js      # Main game loop and coordination
├── player.js    # Player entity, movement, and rendering
├── input.js     # Keyboard input handling
├── camera.js    # Camera positioning and following logic
├── world.js     # World generation and collision detection
├── config.js    # Centralized game configuration
└── utils.js     # Common utility functions and constants
```

## 🎮 Controls

- **WASD** or **Arrow Keys**: Move player
- Game automatically saves position and updates UI in real-time

## 🔧 Configuration

Game settings can be easily modified in `src/config.js`:

- Player speed, size, and starting position
- World dimensions and obstacle density
- Camera smoothing factor
- Tile size and colors

## 🛠️ Development

The game uses ES6 modules for better code organization:

- **Player Module**: Handles all player-related logic including movement, rendering, health management
- **Input Module**: Manages keyboard input with helper methods for movement detection
- **Camera Module**: Provides smooth camera following with world/screen coordinate conversion
- **World Module**: Handles world generation, collision detection, and tile rendering
- **Utils Module**: Common math functions, collision detection, and game constants
- **Config Module**: Centralized configuration for easy tweaking of game parameters

## 🎯 Key Benefits of This Architecture

1. **Low Code Count**: Each module is focused and concise
2. **Scalability**: Easy to add new features without affecting existing code
3. **Maintainability**: Clear separation of concerns makes debugging easier
4. **Reusability**: Modules can be easily reused or swapped out
5. **Configurability**: Central config makes balancing and tweaking simple

## 🚀 Running the Game

1. Open `index.html` in a modern web browser
2. Or serve via HTTP server: `python -m http.server 8000`
3. Navigate to `http://localhost:8000`

The game requires a modern browser that supports ES6 modules.

## 🎮 Gameplay

Navigate through a randomly generated world using the blue player character. The world contains walls (darker tiles) and floors (lighter tiles). The camera smoothly follows the player, and the UI displays current health and position coordinates.

## 🔮 Future Enhancements

The modular structure makes it easy to add:
- NPCs and enemies
- Inventory system
- Combat mechanics
- Save/load functionality
- Sound effects
- Multiple levels
- Power-ups and items

## 📊 Code Metrics

**Before Refactoring:**
- Single file: 263 lines
- All code in one module
- Difficult to maintain and extend

**After Refactoring:**
- 6 focused modules
- ~50-80 lines per module
- Clear separation of concerns
- Easy to test and extend
