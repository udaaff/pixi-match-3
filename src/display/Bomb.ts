import { Container, Sprite } from "pixi.js";
import { int } from "../utils/integer";
import { BoardObject, BoardObjectParams, IBomb, Matchable } from "./BoardObject";
import { ParallelProcess } from "../process/ParallelProcess";
import { getMatchTypeByEntityID } from "../model/matchColor";
import { cfg } from "../game/cfg";

export abstract class Bomb extends BoardObject implements IBomb, Matchable {
    public isLast = false;
    public isAuto = false;
    public triggerMatchType = -1;
    public bombType = -1;
    public readonly matchType: int;
    protected readonly _container = new Container();
    protected readonly _image: Sprite;
    protected readonly _imageTN: string;
    // protected readonly _highlight: Sprite;
    // private _blinkAction: ParallelProcess;
    private readonly _entityIDToTextureName: { [key: number]: string };
    // private readonly _impulsController: ImpulsProcess;
    private readonly _impulsContainer = new Container();

    constructor(params: BoardObjectParams, idToTextureName: { [key: number]: string }) {
        super(params);
        this._entityIDToTextureName = idToTextureName;

        this.addChild(this._impulsContainer)
        this._impulsContainer.addChild(this._container);

        this.matchType = getMatchTypeByEntityID(this.entityID);
        if (!(this.entityID in this._entityIDToTextureName))
            throw new Error("No texture name associated with the entity id");

        this._imageTN = this._entityIDToTextureName[this.entityID];
        this._image = Sprite.from(this._imageTN);
        this._image.anchor.set(0.5);
        this._image.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
        this._container.addChild(this._image);
    }

    public get auto(): Boolean {
        throw new Error("Method not implemented.");
    }

    public set auto(value: Boolean) {
        throw new Error("Method not implemented.");
    }

    public get last(): Boolean {
        throw new Error("Method not implemented.");
    }

    public set last(value: Boolean) {
        throw new Error("Method not implemented.");
    }

    public startBlinking(): void {
        throw new Error("Method not implemented.");
    }
}