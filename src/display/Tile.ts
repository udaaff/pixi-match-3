import { Sprite } from "pixi.js";

import { cfg } from "../game/cfg";
import { BoardObject } from "./BoardObject";

export class Tile extends BoardObject {
    constructor() {
        super();

        const tile = Sprite.from("board/tiles/tile");
        tile.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
        tile.alpha = 0.5;
        this.addChild(tile);
    }
}