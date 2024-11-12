import { Container, Sprite } from "pixi.js";
import { cfg } from "../game/cfg";
import { EntityID } from "../model/EntityID";
import { int } from "../utils/integer";
import { BoardObject } from "./BoardObject";
import { disposeObject, getObject } from "../pool/pool";

const _numLivesToIDs = [null, [null, 1], [null, 2, 1]];

export class Sand extends BoardObject {
    private _lifeToIDMap: (null | int)[] | null;
    private _container: Container;
    private _image: Sprite | null = null;
    private _imageTN: String = "";
    private _defaultNumLives: int;

    constructor(entityID: int) {
        super({ entityID })

        this._container = new Container();
        this._container.y = -cfg.boardCellHeight / 2;
        this._container.x = -cfg.boardCellWidth / 2;

        this.addChild(this._container);

        switch (this.entityID) {
            case EntityID.BG_ITEM_SAND_1:
                this._numLives = 1;
                break;
            case EntityID.BG_ITEM_SAND_2:
                this._numLives = 2;
                break;
        }

        this._lifeToIDMap = _numLivesToIDs[this._numLives];
        this._defaultNumLives = this._numLives;
        // this.updateImage();
    }

    private updateImage(): void {
        if (this._image) {
            disposeObject(this._image, this._imageTN);
            this._container.removeChild(this._image);
        }

        if (!this._lifeToIDMap || !this._lifeToIDMap[this._numLives])
            throw new Error(`There is no map for id ${this.entityID}`);

        this._imageTN = `sand_${this._lifeToIDMap[this._numLives]}`;
        this._image = getObject(Sprite, this._imageTN);
        this._image.setSize(
            cfg.boardCellWidth, cfg.boardCellHeight
        );
        this._container.addChild(this._image);
    }

    public override set numLives(value: int) {
        if (this._numLives > 0)
            return;

        this._numLives = value;
        this.updateImage();
    }

    public override onGetFromPool(): void {
        this.scale.set(1)
        this.alpha = 1;
        this.isBlocked = false;
        this.coordinates = null;
        this._numLives = this._defaultNumLives;
        this.updateImage();
    }

    public override onDisposeToPool(): void {
        disposeObject(this._image, this._imageTN);
        if (!this._image)
            return;
        this._container.removeChild(this._image);
        this._image = null;
    }
}