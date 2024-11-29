import { Point } from "pixi.js";
import { getDistance } from "../display/Board";
import { GameplayInternal } from "./GameplayInternal";
import { TweenProcess } from "./TweenProcess";
import { cfg } from "../game/cfg";
import { BoardCoordinates } from "../model/BoardCoordinates";

export class ScrollBoard extends GameplayInternal {
    private _tween: TweenProcess | null = null;
    private _point!: Point;

    protected override onStart(): void {
        const wayPoints = this.ctx.model.wayPoints.concat();
        const path = wayPoints.reverse();
        const startCoord = path[0];
        this._point = this.convertToPoint(startCoord);

        this.ctx.view.movingContainerX = this._point.x;
        this.ctx.view.movingContainerY = this._point.y;

        if (path.length < 2) {
            this.complete();
            return;
        }

        let duration = 0;
        const bezierPoints = [];
        for (let i = 1; i < path.length; i++) {
            const distance = getDistance(path[i - 1], path[i]);
            duration += distance * cfg.boardMoveSpeedFactor;

            const point = this.convertToPoint(path[i]);
            bezierPoints.push(point);
        }

        this._tween = new TweenProcess(this._point, {
            duration,
            ease: "sine.inOut",
            delay: cfg.boardMoveDelay,
            onUpdate: () => this.onTweenUpdate(),
            motionPath: bezierPoints,
        });
        this._tween.onComplete.connect(_p => this.complete());
        this._tween.start();
    }

    protected override onStop(): void {
        this._tween?.stop();
    }

    private onTweenUpdate(): void {
        this.ctx.view.movingContainerX = this._point.x;
        this.ctx.view.movingContainerY = this._point.y;
    }

    private convertToPoint(coordinates: BoardCoordinates): Point {
        return new Point(
            cfg.boardX0 - cfg.boardCellWidth * coordinates.column,
            cfg.boardY0 - cfg.boardCellHeight * coordinates.row
        );
    }
}