import { Sprite, textureFrom } from "pixi.js";
import { getRandomUint } from "../utils/random";
import { cfg } from "../game/cfg";

export class Rock extends Sprite {
    constructor() {
        super();

        this.texture = textureFrom(`board/blocks/rock_${getRandomUint(4) + 1}`);
        this.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
    }
}