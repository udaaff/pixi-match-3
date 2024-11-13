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

export interface BoardObjectParams {
    isMoveable?: boolean;
    isMatchable?: boolean;
    isHBomb?: boolean;
    isGem?: boolean;
    isSleepable?: boolean;
    isAffectable?: boolean;
    isCollectable?: boolean;
    isFrozen?: boolean;
    isLock?: boolean;
    isKey?: boolean;
    isSoil?: boolean;
    hasEye?: boolean;
    hasCrystal?: boolean;
    entityID: int;
}

export abstract class BoardObject extends Container implements PoolClient {
    private readonly _isMoveable: boolean;
    private readonly _isMatchable: boolean;
    private readonly _isSleepable: boolean;
    private readonly _hasEye: boolean;
    private readonly _hasCrystal: boolean;
    protected _numLives: int = 1;
    public readonly isFrozen: boolean;
    public readonly isLock: boolean;
    public readonly entityID: int;
    public readonly isKey: boolean;
    public readonly isAffectable: boolean;
    public readonly isSoil: boolean;
    public readonly isCollectable: boolean;

    public isBlocked = false;
    public coordinates: BoardCoordinates | null = null;

    constructor(params?: BoardObjectParams) {
        super();
        this._isMoveable = params?.isMoveable ?? false;
        this._isMatchable = params?.isMatchable ?? false;
        this._isSleepable = params?.isSleepable ?? false;
        this._hasEye = params?.hasEye ?? false;
        this._hasCrystal = params?.hasCrystal ?? false;
        this.isFrozen = params?.isFrozen ?? false;
        this.isLock = params?.isLock ?? false;
        this.isKey = params?.isKey ?? false;
        this.isSoil = params?.isSoil ?? false;
        this.isAffectable = params?.isAffectable ?? false;
        this.isCollectable = params?.isCollectable ?? false;
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

    public isEyeType(): this is HasEye {
        return this._hasEye;
    }

    public isCrystalType(): this is HasCrystal {
        return this._hasCrystal;
    }

    public onGetFromPool(): void { }
    public onDisposeToPool(): void { }

    public get numLives(): int { return this._numLives; }
    public set numLives(_value: int) { }

    public get highlightAlpha(): Number { return 0; }
    public set highlightAlpha(_value: Number) { }

    public get highlight(): Sprite | null { return null; }
}
