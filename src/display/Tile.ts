import { Sprite } from "pixi.js";
import { BoardObject } from "./BoardObject";
import { cfg } from "../game/cfg";

export class Tile extends BoardObject {
    constructor() {
        super();

        const tile = Sprite.from("floor_b");
        tile.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
        this.addChild(tile);
    }
}