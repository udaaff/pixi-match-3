import { Container } from "pixi.js";

/**
 * Main container for all game objects.
 *
 * 0. Background.
 * 1. Grid surrounding tiles.
 * 2. Tiles.
 * 3. Container for tile surfaces (e.g., grass).
 * 4. Game "pieces".
 * 5. States (ice, lock, etc.).
 * 6. Animations.
 */
export class Board extends Container {
    public readonly tilesContainer = new Container();

    constructor() {
        super();
        this.addChild(this.tilesContainer);
    }
}