import { Signal } from "typed-signals";

import { int, SafeInt } from "../utils/integer";
import { LevelData } from "./LevelData";
import { getScoreByMatchType, SCORE_TARGET } from "./score";
import { TargetData } from "./TargetData";

export class GameSessionData {
    private _numMoves = new SafeInt();
    private _score = new SafeInt();
    public readonly stars: number[] = [];
    public readonly onNumMovesChanged = new Signal<() => void>();
    public readonly onScoreChanged = new Signal<() => void>();
    public readonly targets: TargetData[] = [];
    private readonly _entityID2TargetData = new Map<int, TargetData>();

    constructor(public readonly levelData: LevelData) {
        this._numMoves.value = levelData.numMoves;

        for (const target of levelData.targets) {
            const clone = target.clone();
            this.targets.push(clone);
            this._entityID2TargetData.set(clone.entityID, clone);
        }

        let minScore: int = 0;
        for (const target of this.targets) {
            minScore += target.amount * SCORE_TARGET;
        }

        for (let i = 0; i < 3; i++) {
            this.stars[i] = levelData.starLevels[i] / 100 * minScore;
        }
    }

    /** not less than one star */
    public getNumStars(): int {
        const score = this.score;
        if (score < this.stars[1])
            return 1;
        if (score < this.stars[2])
            return 2;
        return 3;
    }

    public get score(): int { return this._score.value; }
    public set score(value: int) {
        this._score.value = value;
        this.onScoreChanged.emit();
    }

    public addScoreByMatchType(matchType: string): void {
        this.score += getScoreByMatchType(matchType);
    }

    public get numMoves() { return this._numMoves.value; }
    public set numMoves(value: int) {
        this._numMoves.value = value;
        this.onNumMovesChanged.emit();
    }

    public getTargetByEntityID(entityID: int): TargetData {
        const targetData = this._entityID2TargetData.get(entityID);
        if (targetData === undefined)
            throw new Error(`TargetData for entityID ${entityID} not found.`);
        return targetData;
    }

    public isTarget(entityID: int): boolean {
        return !!this._entityID2TargetData.get(entityID);
    }

    public targetDone(entityID: int): boolean {
        if (!this.isTarget(entityID))
            return false;

        return this.getTargetByEntityID(entityID).amount === 0;
    }

    public allTargetsDone(): boolean {
        for (const targetData of this.targets) {
            if (targetData.amount !== 0)
                return false;
        }
        return true;
    }
}