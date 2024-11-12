import { Container } from "pixi.js";
import { cfg } from "../game/cfg";
import { EntityID } from "../model/EntityID";
import { int } from "../utils/integer";
import { BoardObject } from "./BoardObject";

const _numLivesToIDs = [null, [null, 1], [null, 2, 1]];

export class Sand extends BoardObject {
    private _lifeToIDMap:Array;
    private _container:Sprite;
    private _image:Image;
    private _imageTN:String;
    private _defaultNumLives:int;

    constructor(entityID: int) {
        super({ entityID })

        this._container = new Container();
        this._container.y = -cfg.boardCellHeight / 2;
        this._container.x = -cfg.boardCellWidth / 2;

        this.addChild(this._container);

        // entity graphic
        switch (this.entityID)
        {
            case EntityID.BG_ITEM_SAND_1:
                this._numLives = 1;
                break;
            case EntityID.BG_ITEM_SAND_2:
                this._numLives = 2;
                break;
        }

        this._lifeToIDMap = _numLivesToIDs[this._numLives];
        this._defaultNumLives = this._numLives;
        this.updateImage();
    }

    private updateImage():void
    {
        if (this._image)
        {
            M3Pool.disposeImage(this._image, this._imageTN);
            this._container.removeChild(this._image);
        }

        this._imageTN = SAND_NAME_BASE + this._lifeToIDMap[this._numLives];
        this._image = M3Pool.getImage(this._imageTN);
        this._container.addChild(this._image);
    }

    override public function set numLives(value:int):void
    {
        if (this._numLives == 0)
            return;

        this._numLives--;
        this.updateImage();
    }

    override public function fromPoolHandler():void
    {
        this.scaleX = 1;
        this.scaleY = 1;
        this.alpha = 1;
        this._isBlocked = false;
        this._coordinates = null;
        this._numLives = this._defaultNumLives;
        this.updateImage();
    }

    override public function toPoolHandler():void
    {
        M3Pool.disposeImage(this._image, this._imageTN);
        this._container.removeChild(this._image);
        this._image = null;
    }
}