import { Sprite } from "pixi.js";

import { cfg } from "../game/cfg";
import { BoardObject } from "./BoardObject";

export class Tile extends BoardObject {
    constructor() {
        super();

        const tile = Sprite.from("floor_g");
        tile.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
        this.addChild(tile);
    }
}