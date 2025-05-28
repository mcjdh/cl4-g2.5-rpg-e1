# Design Document: 2D Top-Down Web RPG

This document outlines common approaches and technologies for developing a 2D top-down RPG for web browsers.

## 1. Core Technologies

*   **HTML5 Canvas:** The primary rendering surface. The `<canvas>` element will be used to draw all game graphics.
*   **JavaScript (ES6+):** The core programming language for game logic, rendering, input handling, and potentially server communication.
*   **CSS3:** For styling UI elements that might be overlaid on the canvas (e.g., menus, HUD elements if not drawn directly on canvas).

## 2. Game World & Rendering

*   **Tile-Based Maps:**
    *   The world will be constructed from a grid of tiles.
    *   Each tile represents a specific type of terrain or a static object.
    *   **Tooling:** Consider using a map editor like [Tiled Map Editor](https://www.mapeditor.org/) to design levels. Exported maps (e.g., in JSON format) can then be loaded and rendered by the game.
*   **Sprites & Sprite Sheets:**
    *   Characters, enemies, items, and other dynamic entities will be represented by 2D sprites.
    *   Animations (e.g., walking, attacking) will be achieved using sprite sheets to optimize performance and asset management.
*   **Layers & Depth (Z-ordering):**
    *   Implement a layering system to control the draw order of game elements (e.g., background, characters, foreground objects, UI). This can be as simple as drawing in a specific order or using a more formal z-index.
    *   **YSort:** For top-down games, Y-sorting is common, where objects lower on the screen (higher Y-coordinate) are drawn on top of objects higher on the screen, creating a pseudo-3D effect.
*   **Camera System:**
    *   Implement a camera that follows the player character.
    *   The camera will define the portion of the game world visible on the screen.
    *   Consider features like smooth camera movement or zooming.

## 3. Game Loop

A standard game loop will be implemented:

1.  **Process Input:** Handle keyboard (and potentially mouse/touch) events for player actions.
2.  **Update Game State:**
    *   Move player and non-player characters (NPCs).
    *   Execute AI logic for NPCs/enemies.
    *   Update animations.
    *   Check for collisions.
    *   Process game events (e.g., quest triggers, dialogues).
3.  **Render:**
    *   Clear the canvas.
    *   Draw the visible portion of the tilemap.
    *   Draw game objects (characters, items, effects) according to their layer and position.
    *   Draw UI elements (HUD, menus, dialogue boxes).

## 4. Gameplay Mechanics

*   **Player Character:**
    *   Movement (e.g., 4-directional or 8-directional).
    *   Stats (e.g., health, mana, experience).
    *   Inventory system.
    *   Interaction with objects and NPCs.
*   **NPCs & Enemies:**
    *   Movement patterns.
    *   Dialogue systems for friendly NPCs.
    *   AI for combat (for enemies).
*   **Combat System (if applicable):**
    *   Turn-based or real-time.
    *   Attack animations and effects.
    *   Damage calculation.
*   **Quests & Story:**
    *   System for managing quest objectives and progress.
    *   Dialogue display for story elements.
*   **Collision Detection:**
    *   Grid-based or bounding box collision for interactions between characters and the environment/other characters.

## 5. User Interface (UI)

*   **HUD (Heads-Up Display):** Display player health, mana, current quest, etc.
*   **Menus:** Main menu, pause menu, inventory screen, character stats screen.
*   **Dialogue Boxes:** For conversations with NPCs and displaying story text.
    *   Consider a "typewriter" effect for text display.
*   **Implementation:** UI can be drawn directly on the canvas or built using HTML elements overlaid on the canvas. HTML offers more flexibility for complex UIs and styling with CSS.

## 6. Audio

*   **Web Audio API:** For sound effects (SFX) and background music (BGM).
*   Manage loading and playback of audio assets.

## 7. Game Assets

*   **Graphics:** Pixel art is a common and classic style for 2D RPGs.
    *   Tilesets for maps.
    *   Sprite sheets for characters, enemies, items, and effects.
    *   UI elements (icons, borders, fonts).
*   **Audio:** SFX for actions (walking, attack, item pickup), BGM for different areas/moods.

## 8. Development Approach: Pure JavaScript & Web APIs

For this project, the focus will be on using core web technologies without external game engines or frameworks. This approach provides maximum control and a deep understanding of the underlying mechanics.

*   **HTML5 Canvas:** For all graphics rendering.
*   **JavaScript (ES6+):** For all game logic, including:
    *   Game loop management
    *   State management (player data, game world state)
    *   Input handling (keyboard, mouse/touch)
    *   Rendering 2D graphics and animations on the Canvas
    *   Collision detection
    *   AI for NPCs/enemies
    *   UI logic (if rendering UI directly on canvas)
*   **CSS3:** For styling any HTML-based UI elements (if not drawing all UI on canvas) and the overall page.
*   **Web Audio API:** For all sound effects and background music.

**Considerations for Pure JS Development:**

*   **Pros:**
    *   No external dependencies, resulting in a potentially smaller project footprint.
    *   Complete control over every aspect of the game.
    *   Excellent learning opportunity for understanding fundamental game development concepts.
*   **Cons:**
    *   Requires building many systems from scratch (e.g., sprite animation, robust collision detection, tilemap rendering, vector math, tweening/easing functions, asset loading utilities).
    *   Can be significantly more time-consuming for complex games compared to using a framework.
    *   May require more effort to optimize performance for complex scenes or a large number of game objects.

All features like sprite handling, animation, tilemap rendering, physics (if any), and UI will need to be custom-built or implemented using vanilla JavaScript and browser APIs.

## 9. Project Structure (Example)

```
/project-root
|-- /assets
|   |-- /images
|   |   |-- /tilesets
|   |   |-- /sprites
|   |   |-- /ui
|   |-- /audio
|   |   |-- /sfx
|   |   |-- /bgm
|   |-- /maps (e.g., JSON files from Tiled)
|-- /src (or /js)
|   |-- main.js (or game.js - entry point)
|   |-- /core
|   |   |-- GameObject.js
|   |   |-- Sprite.js
|   |   |-- GameLoop.js
|   |   |-- InputHandler.js
|   |   |-- AssetLoader.js
|   |-- /entities
|   |   |-- Player.js
|   |   |-- NPC.js
|   |   |-- Enemy.js
|   |-- /world
|   |   |-- Tilemap.js
|   |   |-- Camera.js
|   |-- /ui
|   |   |-- Menu.js
|   |   |-- Dialogue.js
|   |-- /utils
|-- index.html
|-- style.css
|-- design.md (this file)
|-- README.md
```

## 10. Key Development Stages

1.  **Setup:** Basic HTML file with a `<canvas>` element, CSS for basic styling, and main JavaScript file.
2.  **Core Rendering Engine (Canvas):**
    *   Function to clear the canvas.
    *   Function to draw images (sprites, tiles).
    *   Basic asset loader for images.
3.  **Game Loop Implementation:**
    *   `requestAnimationFrame` for smooth animations.
    *   Separate update logic and render logic.
4.  **Tilemap System:**
    *   Load and parse tilemap data (e.g., from a simple 2D array or a JSON exported from Tiled).
    *   Render the visible portion of the tilemap.
5.  **Sprite & Animation System:**
    *   Player sprite rendering.
    *   Basic sprite sheet animation handling.
6.  **Player Control:**
    *   Keyboard input handling for movement.
    *   Update player position.
7.  **Camera System:**
    *   Implement a camera that translates the canvas context to follow the player.
8.  **Collision Detection:**
    *   Implement tile-based collision (player vs. map).
    *   Implement basic entity-to-entity collision (e.g., AABB - Axis-Aligned Bounding Box).
9.  **NPCs & Basic Interaction:**
    *   Simple NPC rendering and movement (if any).
    *   Basic dialogue display system (can be canvas-drawn or HTML overlay).
10. **User Interface (UI) Basics:**
    *   Develop HUD elements (e.g., health display) drawn on canvas or as HTML overlays.
    *   Basic menu system.
11. **Web Audio API Integration:**
    *   Load and play sound effects.
    *   Load and play background music.
12. **Expand Gameplay Mechanics:**
    *   Inventory, stats, combat (if applicable), quests.
13. **Refinement & Optimization:**
    *   Improve performance.
    *   Add more complex animations and visual effects.
    *   Polish UI/UX.
14. **Bug Fixing & Testing.**

This design provides a starting point. Specific choices will depend on the project's scope, desired features, and team expertise. 