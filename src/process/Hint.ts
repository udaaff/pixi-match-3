import { Point } from "pixi.js";
import { BoardObject } from "../display/BoardObject";
import { Swap } from "../model/Swap";
import { GameplayInternal } from "./GameplayInternal";
import { ParallelProcess } from "./ParallelProcess";
import { getCenterAtCoordinates } from "../display/Board";
import { RepeatCall } from "./RepeatCall";
import { addProcess } from "./processRunner";
import { TweenProcess } from "./TweenProcess";

const DURATION = .5;
const REPEAT_COUNT = 1;
const SCALE = 1.06;
const DISTANCE = 8;

export class Hint extends GameplayInternal {
    private _object1: BoardObject;
    private _object2: BoardObject;
    private _object1Point!: Point;
    private _object2Point!: Point;
    private _parallelAction: ParallelProcess | null = null;
    private _repeatCall!: RepeatCall;

    constructor(swap: Swap) {
        super();
        this._object1 = swap.object1;
        this._object2 = swap.object2;
    }

    protected override onStart(): void {
        if (!this._object1.coordinates || !this._object2.coordinates)
            throw new Error("provided object doesn't have coordinates");

        this._object1Point = getCenterAtCoordinates(this._object1.coordinates);
        this._object2Point = getCenterAtCoordinates(this._object2.coordinates);
        this._repeatCall = new RepeatCall(() => this.onInterval(), 5000).start();
    }

    protected override onStop(): void {
        if (!this._object1.coordinates || !this._object2.coordinates)
            throw new Error("provided object doesn't have coordinates");

        this._repeatCall.stop();

        if (this._parallelAction) {
            this._parallelAction.stop();

            let dist: number;
            let duration: number;

            // vertical or horizontal
            if (this._object1.coordinates.row == this._object2.coordinates.row)
                dist = Math.abs(this._object1.x - this._object1Point.x);
            else
                dist = Math.abs(this._object1.y - this._object1Point.y);

            duration = DURATION * dist / DISTANCE;

            addProcess(new TweenProcess(this._object1, { duration, highlightAlpha: 0 }), "animation", false);
            addProcess(new TweenProcess(this._object2, { duration, highlightAlpha: 0 }), "animation", false);
            addProcess(new TweenProcess(this._object1, { duration, pixi: { scaleX: 1, scaleY: 1 } }), "animation", false);
            addProcess(new TweenProcess(this._object2, { duration, pixi: { scaleX: 1, scaleY: 1 } }), "animation", false);
            addProcess(new TweenProcess(this._object1, { duration, pixi: {
                positionX: this._object1Point.x,
                positionY: this._object1Point.y
            } }), "animation", false);
            addProcess(new TweenProcess(this._object2, { duration, pixi: {
                positionX: this._object2Point.x,
                positionY: this._object2Point.y
            } }), "animation", false);
        }
    }

    private onInterval(): void {
        if (!this._object1.coordinates || !this._object2.coordinates)
            throw new Error("provided object doesn't have coordinates");

        const { x1, x2, y1, y2 } = this.calculateOffsets(this._object1, this._object2, DISTANCE);

        this._parallelAction = new ParallelProcess([
            new TweenProcess(this._object1, {
                duration: DURATION,
                highlightAlpha: 1,
                pixi: {
                    scaleX: SCALE,
                    scaleY: SCALE,
                    positionX: x1,
                    positionY: y1,
                },
                repeat: REPEAT_COUNT,
                yoyo: true,
                ease: "back.out" // adjust
            }),
            new TweenProcess(this._object2, {
                duration: DURATION,
                highlightAlpha: 1,
                pixi: {
                    scaleX: SCALE,
                    scaleY: SCALE,
                    positionX: x2,
                    positionY: y2,
                },
                repeat: REPEAT_COUNT,
                yoyo: true,
                ease: "back.out"
            })
        ]).start();
    }

    private calculateOffsets(object1: BoardObject, object2: BoardObject, distance: number) {
        if (!object1.coordinates || !object2.coordinates)
            throw new Error("provided object doesn't have coordinates");

        const x1 = object1.x + (object1.coordinates.row === object2.coordinates.row
            ? distance * Math.sign(object2.coordinates.column - object1.coordinates.column)
            : 0);

        const x2 = object2.x - (object1.coordinates.row === object2.coordinates.row
            ? distance * Math.sign(object2.coordinates.column - object1.coordinates.column)
            : 0);

        const y1 = object1.y + (object1.coordinates.row !== object2.coordinates.row
            ? distance * Math.sign(object2.coordinates.row - object1.coordinates.row)
            : 0);

        const y2 = object2.y - (object1.coordinates.row !== object2.coordinates.row
            ? distance * Math.sign(object2.coordinates.row - object1.coordinates.row)
            : 0);

        return { x1, x2, y1, y2 };
    }
}