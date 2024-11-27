import { BarrelBomb } from "../display/BarrelBomb";
import { centerObjectAt } from "../display/Board";
import { BoardObject } from "../display/BoardObject";
import { ColorBomb } from "../display/ColorBomb";
import { Freeze } from "../display/Freeze";
import { Gem } from "../display/Gem";
import { Lock } from "../display/Lock";
import { Sand } from "../display/Sand";
import { Soil } from "../display/Soil";
import { Stone } from "../display/Stone";
import { cfg } from "../game/cfg";
import { BoardCoordinates } from "../model/BoardCoordinates";
import { BombType, getBombTypeByEntityID } from "../model/BombType";
import { EntityID } from "../model/EntityID";
import { get3x3BombIdByMatchType, getHBombIdByMatchType, getVBombIdByMatchType } from "../model/matchColor";
import { Viewport } from "../model/Viewport";
import { getObject } from "../pool/pool";
import { getRandomElement, shuffle } from "../utils/arrayUtils";
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
                    const sand = getObject(Sand, tileData.bgItem);
                    this.ctx.model.registerBGItemAt(sand, i, j);
                    centerObjectAt(sand, i, j);
                    this.ctx.view.bgItemsContainer.addChild(sand);
                }

                let boardObject: BoardObject | null = null;

                if (tileData.block !== EntityID.ENTITY_NONE) {
                    if (tileData.block == EntityID.BLOCK_SOIL)
                        boardObject = getObject(Soil, tileData.block);
                    else if (tileData.block == EntityID.BLOCK_SOIL_KEY)
                        boardObject = getObject(BarrelBomb, tileData.block);
                    else
                        boardObject = getObject(Stone, tileData.block);
                }
                else if (tileData.bomb !== EntityID.ENTITY_NONE) {
                    let bombEntityID: int;
                    const bombType: int = getBombTypeByEntityID(tileData.bomb);
                    const matchType = getRandomElement(this.ctx.model.spawnableMatchTypes);
                    if (matchType === null)
                        throw new Error("there are no spawnableMatchTypes");

                    if (tileData.bomb == EntityID.BOMB_3x3_ANY) {
                        bombEntityID = get3x3BombIdByMatchType(matchType);
                    }
                    else if (tileData.bomb == EntityID.BOMB_V_LINE_ANY) {
                        bombEntityID = getVBombIdByMatchType(matchType);
                    }
                    else if (tileData.bomb == EntityID.BOMB_H_LINE_ANY) {
                        bombEntityID = getHBombIdByMatchType(matchType);
                    }
                    else {
                        bombEntityID = tileData.bomb;
                    }

                    if (bombType == BombType.COLOR)
                        boardObject = getObject(ColorBomb, bombEntityID);
        //             else if (bombType == BombType.HORIZONTAL)
        //                 boardObject = M3Pool.getHBomb(bombEntityID);
        //             else if (bombType == BombType.VERTICAL)
        //                 boardObject = M3Pool.getVBomb(bombEntityID);
        //             else if (bombType == BombType.SQUARE_3x3)
        //                 boardObject = M3Pool.getSquareBomb(bombEntityID);
                }
                else if (tileData.gem !== EntityID.ENTITY_NONE) {
                    boardObject = getObject(Gem, tileData.gem);
                }
                else if (!tileData.empty) {
                    boardObject = getObject(Gem, this.ctx.model.spawn())
                    randomGems.push(boardObject);
                    coordinates.push(new BoardCoordinates(i, j));
                }

                if (boardObject) {
                    this.ctx.model.registerGemAt(boardObject, i, j);
                    boardObject = null;
                }

                if (tileData.freeze !== EntityID.ENTITY_NONE) {
                    const freeze = getObject(Freeze, tileData.freeze);
                    this.ctx.model.registerFreezeAt(freeze, i, j);
                    centerObjectAt(freeze, i, j);
                    this.ctx.view.freezesContainer.addChild(freeze);
                }

                if (tileData.lock !== EntityID.ENTITY_NONE) {
                    const lock = getObject(Lock, tileData.lock);
                    this.ctx.model.registerLockAt(lock, i, j);
                    centerObjectAt(lock, i, j);
                    this.ctx.view.locksContainer.addChild(lock);
                }

                if (tileData.crystal !== EntityID.ENTITY_NONE) {
        //             let soil: Soil = Soil(this.ctx.model.getGemAt(i, j));
        //             let crystal: Crystal = soil.addCrystal(tileData.crystal);
        //             this.ctx.model.registerCrystalAt(crystal, i, j);
                }
            }
        }

        let n: int = 0;
        const viewport = new Viewport(iLength, jLength);
        const matcher = this.ctx.model.matcher;
        while (!matcher.hasMove() || matcher.hasMatch(viewport)) {
            if (++n == cfg.maxShuffleAttemps)
                throw new Error("Reached max number of shuffle attempts.")

            shuffle(randomGems);

            for (let i = 0; i < randomGems.length; i++) {
                this.ctx.model.registerGemAt(randomGems[i], coordinates[i].row, coordinates[i].column);
            }
        }
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX ", n)

        for (let i = 0; i < iLength; i++) {
            for (let j = 0; j < jLength; j++) {
                const boardObject = this.ctx.model.getGemAt(i, j);
                if (!boardObject)
                    continue;

                centerObjectAt(boardObject, i, j);
                if (boardObject.isSoil)
                    this.ctx.view.soilContainer.addChild(boardObject);
                else
                    this.ctx.view.gemsContainer.addChild(boardObject);
            }
        }
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