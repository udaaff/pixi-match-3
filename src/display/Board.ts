import { Container, Point } from "pixi.js";
import { BoardCoordinates } from "../model/BoardCoordinates";
import { cfg } from "../game/cfg";
import { int } from "../utils/integer";
import { BoardObject } from "./BoardObject";
import { app } from "../main";

export function moveObjectTo(object: BoardObject, row: int, column: int): void {
    object.x = cfg.boardCellWidth * column;
    object.y = cfg.boardCellHeight * row;
}

/** Places the object at the center of the cell with coordinates row, column. */
export function centerObjectAt(object: BoardObject, row: int, column: int): void {
    object.x = cfg.boardCellWidth * column + cfg.boardCellWidth / 2;
    object.y = cfg.boardCellHeight * row + cfg.boardCellHeight / 2;
}

/** Returns the center point of the cell with the specified coordinates. */
export function getCenterAtCoordinates(coordinates: BoardCoordinates): Point {
    return new Point(
        coordinates.column * cfg.boardCellWidth + cfg.boardCellWidth / 2,
        coordinates.row * cfg.boardCellHeight + cfg.boardCellHeight / 2
    );
}

export function getCenter(): Point {
    return new Point(
        cfg.boardCellWidth * cfg.viewportHLength / 2,
        cfg.boardCellHeight * cfg.viewportVLength / 2
    );
}

export function getStageCenter(): Point {
    return new Point(
        app.screen.width * 0.5,
        app.screen.height * 0.5
    );
}

/** Distance from one cell to another. */
export function getDistance(coordinates1: BoardCoordinates, coordinates2: BoardCoordinates): number {
    var dx: int = (coordinates2.column - coordinates1.column) * cfg.boardCellWidth;
    var dy: int = (coordinates2.row - coordinates1.row) * cfg.boardCellHeight;
    return Math.sqrt(dx * dx + dy * dy);
}

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
    public readonly movingContainer = new Container();
    public readonly shakingContainer = new Container();
    public readonly tilesContainer = new Container();
    public readonly rockTilesContainer = new Container();
    public readonly soilContainer = new Container();
    public readonly gemsContainer = new Container();
    public readonly bgItemsContainer = new Container();
    public readonly locksContainer = new Container();
    public readonly freezesContainer = new Container();
    public readonly selectionContainer = new Container();

    constructor() {
        super();
        // this.scale.set(0.5)
        this.tilesContainer.interactiveChildren = false;
        this.rockTilesContainer.interactiveChildren = false;
        this.soilContainer.interactiveChildren = false;
        this.bgItemsContainer.interactiveChildren = false;
        this.locksContainer.interactiveChildren = false;
        this.freezesContainer.interactiveChildren = false;
        this.selectionContainer.interactiveChildren = false;

        this.addChild(this.movingContainer);
        this.movingContainer.addChild(this.shakingContainer);
        this.shakingContainer.addChild(
            this.tilesContainer,
            this.rockTilesContainer,
            this.bgItemsContainer,
            this.soilContainer,
            this.selectionContainer,
            this.gemsContainer,
            this.locksContainer,
            this.freezesContainer,
        );

        this.gemsContainer.eventMode = "static";
        // this.gemsContainer.on("pointerdown", (e) => console.log(e))
    }

    public get movingContainerX(): number {
        return this.movingContainer.x;
    }

    public set movingContainerX(value: number) {
        value = Math.round(value);
        this.movingContainer.x = value;
        // this._movingAnimationContainer.x = value;
        // this._background.scrollX = -value * .4;
    }

    public get movingContainerY(): number {
        return this.movingContainer.y;
    }

    public set movingContainerY(value: number) {
        value = Math.round(value);
        this.movingContainer.y = value;
        // this._movingAnimationContainer.y = value;
        // this._background.scrollY = 200 - value * .4;
    }
}
