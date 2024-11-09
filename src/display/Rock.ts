import { Sprite, textureFrom } from "pixi.js";
import { getRandomUint } from "../utils/random";
import { cfg } from "../game/cfg";

export class Rock extends Sprite {
    constructor() {
        super();

        this.texture = textureFrom(`stones_g_0${getRandomUint(4) + 1}`);
        this.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
    }
}