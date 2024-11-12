import { centerObjectAt } from "../display/Board";
import { BoardObject } from "../display/BoardObject";
import { Sand } from "../display/Sand";
import { cfg } from "../game/cfg";
import { BoardCoordinates } from "../model/BoardCoordinates";
import { BombType, getBombTypeByEntityID } from "../model/BombType";
import { EntityID } from "../model/EntityID";
import { Viewport } from "../model/Viewport";
import { getObject } from "../pool/pool";
import { shuffle } from "../utils/arrayUtils";
import { int } from "../utils/integer";
import { GameplayInternal } from "./GameplayInternal";

export class InitializeBoard extends GameplayInternal {
    protected override onStart(): void {
        const levelData = this.ctx.model.levelData;
        const iLength = levelData.boardVLength;
        const jLength = levelData.boardHLength;

        const randomGems: BoardObject[] = [];
        const coordinates: BoardCoordinates[] = [];

        this.ctx.model.setSpawners(levelData.spawners);
        this.ctx.model.setSpawnData(levelData.spawns);
        this.ctx.model.setWayPoints(levelData.wayPoints);

        for (let i = 0; i < iLength; i++) {
            for (let j = 0; j < jLength; j++) {
                const tileData = levelData.board[i][j];
                if (!tileData.visible)
                    continue;

                if (tileData.entrance) {
                    const entrance = new BoardCoordinates(tileData.i, tileData.j);
                    const exit = this.getExitByEntrance(entrance);
                    if (!exit)
                        throw new Error("Tunnel must have exit");

                    this.ctx.model.registerTunnel(entrance, exit);
                }

                if (tileData.bgItem !== EntityID.ENTITY_NONE) {
                    let sand: Sand = M3Pool.getSand(tileData.bgItem);
                    const sand = getObject(Sand)
                    this.ctx.model.registerBGItemAt(sand, i, j);
                    centerObjectAt(sand, i, j);
                    this.ctx.view.bgItemsContainer.addChild(sand);
                }

        //         let boardObject: IBoardObject;

        //         if (tileData.block != EntityID.ENTITY_NONE) {
        //             if (tileData.block == EntityID.BLOCK_SOIL)
        //                 boardObject = M3Pool.getSoil(tileData.block);
        //             else if (tileData.block == EntityID.BLOCK_SOIL_KEY)
        //                 boardObject = M3Pool.getBarrelBomb(tileData.block);
        //             else
        //                 boardObject = M3Pool.getStone(tileData.block);
        //         }
        //         else if (tileData.bomb != EntityID.ENTITY_NONE) {
        //             let bombType: int = getBombTypeByEntityID(tileData.bomb);
        //             let bombEntityID: int;
        //             let matchType: int;

        //             if (tileData.bomb == EntityID.BOMB_3x3_ANY) {
        //                 matchType = VectorUtils.getSeededRandomElement(this.ctx.model.spawnableMatchTypes);
        //                 bombEntityID = MatchType.matchTypeTo3x3BombID(matchType);
        //             }
        //             else if (tileData.bomb == EntityID.BOMB_V_LINE_ANY) {
        //                 matchType = VectorUtils.getSeededRandomElement(this.ctx.model.spawnableMatchTypes);
        //                 bombEntityID = MatchType.matchTypeToVBombID(matchType);
        //             }
        //             else if (tileData.bomb == EntityID.BOMB_H_LINE_ANY) {
        //                 matchType = VectorUtils.getSeededRandomElement(this.ctx.model.spawnableMatchTypes);
        //                 bombEntityID = MatchType.matchTypeToHBombID(matchType);
        //             }
        //             else {
        //                 bombEntityID = tileData.bomb;
        //             }

        //             if (bombType == BombType.COLOR)
        //                 boardObject = M3Pool.getColorBomb(bombEntityID);
        //             else if (bombType == BombType.HORIZONTAL)
        //                 boardObject = M3Pool.getHBomb(bombEntityID);
        //             else if (bombType == BombType.VERTICAL)
        //                 boardObject = M3Pool.getVBomb(bombEntityID);
        //             else if (bombType == BombType.SQUARE_3x3)
        //                 boardObject = M3Pool.getSquareBomb(bombEntityID);
        //         }
        //         else if (tileData.gem != EntityID.ENTITY_NONE) {
        //             boardObject = M3Pool.getGem(tileData.gem);
        //         }
        //         else if (!tileData.empty) {
        //             boardObject = M3Pool.getGem(this.ctx.model.spawn());
        //             randomGems.push(boardObject);
        //             coordinates.push(new BoardCoordinates(i, j));
        //         }

        //         if (boardObject) {
        //             this.ctx.model.registerGemAt(boardObject, i, j);
        //             boardObject = null;
        //         }

        //         if (tileData.freeze != EntityID.ENTITY_NONE) {
        //             let freeze: IBoardObject = M3Pool.getFreeze(tileData.freeze);
        //             this.ctx.model.registerFreezeAt(freeze, i, j);
        //             centerObjectAt(freeze, i, j);
        //             this.ctx.view.freezesContainer.addChild(freeze as DisplayObject);
        //         }

        //         if (tileData.lock != EntityID.ENTITY_NONE) {
        //             let lock: IBoardObject = M3Pool.getLock(tileData.lock);
        //             this.ctx.model.registerLockAt(lock, i, j);
        //             centerObjectAt(lock, i, j);
        //             this.ctx.view.locksContainer.addChild(lock as DisplayObject);
        //         }

        //         if (tileData.crystal != EntityID.ENTITY_NONE) {
        //             let soil: Soil = Soil(this.ctx.model.getGemAt(i, j));
        //             let crystal: Crystal = soil.addCrystal(tileData.crystal);
        //             this.ctx.model.registerCrystalAt(crystal, i, j);
        //         }
            }
        }

        // let n: int = 0;
        // const viewport = new Viewport(0, 0, iLength, jLength);
        // const matcher = this.ctx.model.matcher;
        // while (!matcher.hasMove() || matcher.hasMatch(viewport)) {
        //     if (++n == cfg.maxShuffleAttemps)
        //         throw new Error("Reached max number of shuffle attempts.")

        //     shuffle(randomGems);

        //     for (let i = 0; i < randomGems.length; i++) {
        //         this.ctx.model.registerGemAt(randomGems[i], coordinates[i].row, coordinates[i].column);
        //     }
        // }

        // for (let i = 0; i < iLength; i++) {
        //     for (let j = 0; j < jLength; j++) {
        //         const boardObject = this.ctx.model.getGemAt(i, j);
        //         if (!boardObject)
        //             continue;

        //         centerObjectAt(boardObject, i, j);
        //         if (boardObject.isSoil)
        //             this.ctx.view.soilContainer.addChild(boardObject);
        //         else
        //             this.ctx.view.gemsContainer.addChild(boardObject);
        //     }
        // }

        this.complete();
    }

    private getExitByEntrance(entrance: BoardCoordinates): BoardCoordinates | null {
        let row = entrance.row + 1;
        const column = entrance.column;
        const boardVLength = this.ctx.model.boardVLength;
        const board = this.ctx.model.levelData.board

        while (row < boardVLength) {
            const tileData = board[row][column];
            if (tileData && tileData.exit)
                return new BoardCoordinates(tileData.i, tileData.j);
            row++;
        }

        return null;
    }
}