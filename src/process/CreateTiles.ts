import { Tile } from "../display/Tile";
import { cfg } from "../game/cfg";
import { getObject } from "../pool/pool";
import { GameplayInternal } from "./GameplayInternal";

export class CreateTiles extends GameplayInternal {

    protected override onStart(): void {
        const board = this.ctx.model.levelData.board;
        const iLength = this.ctx.model.boardVLength;
        const jLength = this.ctx.model.boardHLength;
        for (let i = 0; i < iLength; i++) {
            for (let j = 0; j < jLength; j++) {
                const tileData = board[i][j];
                if (!tileData.visible)
                    continue;

                const tile = getObject(Tile);
                tile.x = cfg.boardCellWidth * j;
                tile.y = cfg.boardCellHeight * i;
                this.ctx.model.registerTileAt(tile, i, j);
                this.ctx.view.tilesContainer.addChild(tile);
            }
        }

        this.complete();
    }
}