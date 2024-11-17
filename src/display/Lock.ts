import { Sprite } from "pixi.js";
import { int } from "../utils/integer";
import { BoardObject } from "./BoardObject";
import { cfg } from "../game/cfg";

export class Lock extends BoardObject {
    constructor(entityID: int) {
        super({
            entityID,
            isLock: true,
            isAffectable: true
        });

        const image = Sprite.from("block");
        image.anchor.set(0.5);
        image.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
        this.addChild(image);
    }

    public override onGetFromPool(): void {
        this.scale.set(1);
        this.alpha = 1;
    }
}