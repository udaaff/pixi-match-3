import { Container } from "pixi.js"
import { BoardCoordinates } from "../model/BoardCoordinates";
import { PoolClient } from "../pool/pool";

export interface Moveable {
    addImpuls: () => void;
}



export interface BoardObjectParams {
    isMoveable?: boolean;
    isMatchable?: boolean;
    isHBomb?: boolean;
    isGem?: boolean;
    isSleepable?: boolean;
    isAffectable?: boolean;
    hasEye?: boolean;
}

export abstract class BoardObject extends Container implements PoolClient {
    public isBlocked = false;

    public isMoveable = false;

    public coordinates: BoardCoordinates | null = null;

    constructor(params: BoardObjectParams) {
        super();
    }

    public onGetFromPool(): void {}
    public onDisposeToPool(): void {}
}