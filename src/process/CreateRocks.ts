import { Rock } from "../display/Rock";
import { cfg } from "../game/cfg";
import { EntityID } from "../model/EntityID";
import { getObject } from "../pool/pool";
import { GameplayInternal } from "./GameplayInternal";

export class CreateRocks extends GameplayInternal {
    protected override onStart(): void {
        const board = this.ctx.model.levelData.board;
        const iLength = this.ctx.model.boardVLength;
        const jLength = this.ctx.model.boardHLength;
        const rocksContainer = this.ctx.view.rockTilesContainer;

        for (let i = 0; i < iLength; i++) {
            for (let j = 0; j < jLength; j++) {
                const currentX = j * cfg.boardCellWidth;
                const currentY = i * cfg.boardCellHeight;
                const tileData = board[i][j];

                if (tileData.rock !== EntityID.ENTITY_NONE) {
                    const rock = getObject(Rock);
                    rock.x = currentX;
                    rock.y = currentY;
                    rocksContainer.addChild(rock);
                }

                // todo: add Shadow
            }
        }

        // todo: add RockBorderGroup
        this.complete();
    }
}