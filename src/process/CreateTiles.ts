import { Board } from "../display/Board";
import { Tile } from "../display/Tile";
import { cfg } from "../game/cfg";
import { getGameSession } from "../model/app";
import { M3Model } from "../model/M3Model";
import { getObject } from "../pool/pool";
import { Process } from "./Process";

export class CreateTiles extends Process {
    constructor(
        private readonly view: Board,
        private readonly model: M3Model
    ) {
        super();
    }

    protected override onStart(): void {
        const board = getGameSession().levelData.board;
        const iLength = this.model.boardVLength;
        const jLength = this.model.boardHLength;

        for (let i = 0; i < iLength; i++) {
            for (let j = 0; j < jLength; j++) {
                const tileData = board[i][j];
                if (!tileData.visible)
                    continue;

                const tile = getObject(Tile);
                tile.x = cfg.boardCellWidth * j;
                tile.y = cfg.boardCellHeight * i;
                this.model.registerTileAt(tile, i, j);
                this.view.tilesContainer.addChild(tile);
            }
        }

        this.complete();
    }
}