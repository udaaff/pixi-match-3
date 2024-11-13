import { Container, Sprite } from "pixi.js";
import { int } from "../utils/integer";
import { getRandomUint } from "../utils/random";
import { BoardObject, HasCrystal } from "./BoardObject";
import { cfg } from "../game/cfg";
import { getObject } from "../pool/pool";

const MIN_SOIL_ID: int = 1;
const MAX_SOIL_ID: int = 4;

export class Soil extends BoardObject implements HasCrystal {
    private _container: Container;
    private _mc: Sprite;
    // private _crystal:Crystal;

    constructor(entityID: int) {
        super({
            entityID,
            isAffectable: true,
            isSoil: true,
            hasCrystal: true,
        });

        const textureName = `soil_${(MIN_SOIL_ID + getRandomUint(MAX_SOIL_ID))}`;

        this._mc = Sprite.from(textureName);
        this._mc.setSize(cfg.boardCellWidth, cfg.boardCellHeight);

        this._container = new Container();
        this._container.y = -cfg.boardCellWidth / 2;
        this._container.x = -cfg.boardCellHeight / 2;

        super.addChild(this._container);
        this._container.addChild(this._mc);
    }

    // public addCrystal(entityID: int): Crystal {
    //     throw new Error("Method not implemented.");
    // }

    public removeCrystal(): void {
        throw new Error("Method not implemented.");
    }

    public override onGetFromPool(): void {
        this.scale.set(1);
        this.alpha = 1;

        this.isBlocked = false;
        this._numLives = 1;
        this.coordinates = null;
    }

    public override onDisposeToPool(): void {
        // if (this._crystal) {
        //     this._container.removeChild(this._crystal);
        //     M3Pool.disposeObject(this._crystal);
        //     this._crystal = null;
        // }
    }

    // public override set isBlocked(value: Boolean) {
    //     this.isBlocked = value;
    //     // if (this._crystal)
    //     //     this._crystal.isBlocked = value;
    // }
}