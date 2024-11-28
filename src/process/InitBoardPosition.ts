import { cfg } from "../game/cfg";
import { GameplayInternal } from "./GameplayInternal";
import { Process } from "./Process";

export class InitBoardPosition extends GameplayInternal {
    protected override onStart(): void {
        const wayPoints = this.ctx.model.wayPoints;
        const coordinates = wayPoints[wayPoints.length - 1];

        this.ctx.view.movingContainerX = cfg.boardX0 - cfg.boardCellWidth * coordinates.column;
        this.ctx.view.movingContainerY = cfg.boardY0 - cfg.boardCellHeight * coordinates.row;

        super.complete();
    }
}