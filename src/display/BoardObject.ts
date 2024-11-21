import { Container, Sprite } from "pixi.js";

import { BoardCoordinates } from "../model/BoardCoordinates";
import { EntityID } from "../model/EntityID";
import { PoolClient } from "../pool/pool";
import { int } from "../utils/integer";
import { Eye } from "./Eye";

export interface Moveable extends BoardObject {
    addImpuls(): void;
}

export interface Matchable extends BoardObject {
    get matchType(): int;
}

export interface Sleepable extends BoardObject {
    sleep(): void;
    wakeUp(): void;
}

export interface HasEye extends BoardObject {
    getEye(): Eye;
}

export interface HasCrystal extends BoardObject {
    removeCrystal(): void;
}

export interface IBomb extends BoardObject {
    get bombType(): int;
    set bombType(value: int);
    get triggerMatchType(): int;
    set triggerMatchType(value: int);
    get auto(): Boolean;
    set auto(value: Boolean);
    get last(): Boolean;
    set last(value: Boolean);
    startBlinking(): void;
}

export interface BoardObjectParams {
    isMoveable?: boolean;
    isMatchable?: boolean;
    isHBomb?: boolean;
    isBomb?: boolean;
    isGem?: boolean;
    isSleepable?: boolean;
    isAffectable?: boolean;
    isCollectable?: boolean;
    isFreeze?: boolean;
    isLock?: boolean;
    isKey?: boolean;
    isSoil?: boolean;
    isSquareBomb5x5?: boolean;
    isSquareBomb3x3?: boolean;
    hasEye?: boolean;
    hasCrystal?: boolean;
    entityID: int;
}

export abstract class BoardObject extends Container implements PoolClient {
    private readonly _isMoveable: boolean;
    private readonly _isMatchable: boolean;
    private readonly _isSleepable: boolean;
    private readonly _hasEye: boolean;
    private readonly _isBomb: boolean;
    private readonly _hasCrystal: boolean;
    public readonly isFreeze: boolean;
    public readonly isLock: boolean;
    public readonly entityID: int;
    public readonly isKey: boolean;
    public readonly isAffectable: boolean;
    public readonly isSoil: boolean;
    public readonly isCollectable: boolean;
    public readonly isSquareBomb5x5: boolean;
    public readonly isSquareBomb3x3: boolean;
    public coordinates: BoardCoordinates | null = null;
    protected _numLives = 1;
    protected _isBlocked = false;

    constructor(params?: BoardObjectParams) {
        super();
        this._isMoveable = params?.isMoveable ?? false;
        this._isMatchable = params?.isMatchable ?? false;
        this._isSleepable = params?.isSleepable ?? false;
        this._hasEye = params?.hasEye ?? false;
        this._hasCrystal = params?.hasCrystal ?? false;
        this._isBomb = params?.isBomb ?? false;
        this.isFreeze = params?.isFreeze ?? false;
        this.isLock = params?.isLock ?? false;
        this.isKey = params?.isKey ?? false;
        this.isSoil = params?.isSoil ?? false;
        this.isAffectable = params?.isAffectable ?? false;
        this.isCollectable = params?.isCollectable ?? false;
        this.isSquareBomb3x3 = params?.isSquareBomb3x3 ?? false;
        this.isSquareBomb5x5 = params?.isSquareBomb5x5 ?? false;
        this.entityID = params?.entityID ?? EntityID.ENTITY_NONE;
    }

    public isMatchableType(): this is Matchable {
        return this._isMatchable;
    }

    public isMoveableType(): this is Moveable {
        return this._isMoveable;
    }

    public isSleepableType(): this is Sleepable {
        return this._isSleepable;
    }

    public isBombType(): this is IBomb {
        return this._isBomb;
    }

    public isEyeType(): this is HasEye {
        return this._hasEye;
    }

    public isCrystalType(): this is HasCrystal {
        return this._hasCrystal;
    }

    public onGetFromPool(): void {
        this.scale.set(1);
        this.alpha = 1;
        this.rotation = 0;
        this.position.set(0);
        this._isBlocked = false;
        this._numLives = 1;
        this.coordinates = null;
    }
    public onDisposeToPool(): void { }

    public get isBlocked(): boolean { return this._isBlocked }
    public set isBlocked(_value: boolean) {}

    public get numLives(): int { return this._numLives; }
    public set numLives(_value: int) { }

    public get highlightAlpha(): Number { return 0; }
    public set highlightAlpha(_value: Number) { }

    public get highlight(): Sprite | null { return null; }
}
