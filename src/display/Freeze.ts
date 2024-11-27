import { Container, Sprite } from "pixi.js";
import { int } from "../utils/integer";
import { BoardObject } from "./BoardObject";
import { cfg } from "../game/cfg";

export class Freeze extends BoardObject {
    private _container: Container;
    private  _mc:Sprite;

    constructor(entityID: int) {
        super({
            entityID,
            isFreeze: true
        });

        this._mc = Sprite.from("board/states/ice");
        this._mc.setSize(cfg.boardCellWidth, cfg.boardCellHeight);

        this._container = new Container();
        this._container.y = -cfg.boardCellWidth / 2;
        this._container.x = -cfg.boardCellHeight / 2;

        super.addChild(this._container);
        this._container.addChild(this._mc);
    }

    public override onGetFromPool(): void {
        this.scale.set(1);
        this.alpha = 1;
        this._isBlocked = false;
        this.coordinates = null;
    }
}