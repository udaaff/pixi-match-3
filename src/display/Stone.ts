import { Container, Sprite } from "pixi.js";
import { int } from "../utils/integer";
import { BoardObject } from "./BoardObject";
import { cfg } from "../game/cfg";
import { EntityID } from "../model/EntityID";
import { disposeObject, getObject } from "../pool/pool";

const _numLivesToIDs = [
    null,
    [null, 1],
    [null, 3, 1],
    [null, 4, 3, 1],
    [null, 4, 3, 2, 1]
];

export class Stone extends BoardObject {
    private _lifeToIDMap: (number | null)[] | null;
    private _container: Container;
    private _image: Sprite | null = null;
    private _imageTN: String = "";
    private _defaultNumLives: int;

    constructor(entityID: int) {
        super({
            entityID,
            isAffectable: true,
            isSoil: true
        });

        this._container = new Sprite();
        this._container.y = -cfg.boardCellHeight / 2;
        this._container.x = -cfg.boardCellWidth / 2;
        this.addChild(this._container);

        switch (this.entityID) {
            case EntityID.BLOCK_STONE_1:
                this._numLives = 1;
                break;
            case EntityID.BLOCK_STONE_2:
                this._numLives = 2;
                break;
            case EntityID.BLOCK_STONE_3:
                this._numLives = 3;
                break;
            case EntityID.BLOCK_STONE_4:
                this._numLives = 4;
                break;
        }

        this._lifeToIDMap = _numLivesToIDs[this._numLives];
        if (!this._lifeToIDMap)
            throw new Error("no life to id map for specified entity id");

        this._defaultNumLives = this._numLives;
    }

    private updateImage(): void {
        if (this._image) {
            disposeObject(this._image, this._imageTN);
            this._container.removeChild(this._image);
        }

        this._imageTN = `board/blocks/stone_${this._lifeToIDMap![this._numLives]}`;
        this._image = getObject(Sprite, this._imageTN);
        this._image.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
        this._container.addChild(this._image);
    }

    public override set numLives(value: int) {
        if (this._numLives == 0)
            return;

        this._numLives = value;
        this.updateImage();
    }

    public override onGetFromPool(): void {
        this.scale.set(1);
        this.alpha = 1;
        this._isBlocked = false;
        this.coordinates = null;
        this._numLives = this._defaultNumLives;
        this.updateImage();
    }

    public override onDisposeToPool(): void {
        disposeObject(this._image, this._imageTN)
        if (!this._image)
            return;
        this._container.removeChild(this._image);
        this._image = null;
    }
}