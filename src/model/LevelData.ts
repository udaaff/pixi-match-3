import { int } from "../utils/integer";
import { BoardCoordinates } from "./BoardCoordinates";
import { EntityID, getSpawnerIndex, getWayPointIndex } from "./EntityID";
import { SpawnData } from "./SpawnData";
import { TargetData } from "./TargetData";
import { TileData } from "./TileData";

export class LevelData {
    public readonly boardVLength: int;
    public readonly boardHLength: int;
    public readonly id: int;
    public readonly spawns: SpawnData[] = [];
    public readonly numMoves: int;
    public readonly targets: TargetData[] = [];
    public readonly board: TileData[][] = [];
    public readonly spawners: BoardCoordinates[][] = [];
    public readonly wayPoints: BoardCoordinates[] = [];
    /**
     * An array of the form [100, 300, 900], where the values of the elements represent
     * the percentage required to earn a star. 100% represents the points for achieving all goals.
     * This is theoretically the minimum value, though it will always be higher,
     * even if all goals are achieved in a single move.
     */
    public readonly starLevels: int[];

    constructor(data: any) {
        this.id = data.id;
        this.numMoves = data.turns;
        this.boardVLength = data.h;
        this.boardHLength = data.w;
        this.starLevels = data.stars;

        const targetsRaw = data.targets;
        for (const target of targetsRaw) {
            this.targets.push(new TargetData(target));
        }

        const spawnsRaw: [] = data.spawns;
        for (const spawn of spawnsRaw) {
            const spawnData = new SpawnData(spawn);
            if (spawnData.weight == 0)
                continue;

            this.spawns.push(spawnData);
        }

        const boardRaw: [] = data.board;
        for (let i = 0; i < this.boardVLength; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardHLength; j++) {
                if (!boardRaw[i][j])
                    continue;

                const tileData = new TileData(i, j, boardRaw[i][j]);
                this.board[i][j] = tileData;

                if (tileData.wayPoint !== EntityID.ENTITY_NONE)
                    this.wayPoints[getWayPointIndex(tileData.wayPoint)] = new BoardCoordinates(i, j);

                if (tileData.spawner !== EntityID.ENTITY_NONE) {
                    const spawnerIndex = getSpawnerIndex(tileData.spawner);
                    if (!(spawnerIndex in this.spawners))
                        this.spawners[spawnerIndex] = [];

                    this.spawners[spawnerIndex].push(new BoardCoordinates(i, j));
                }
            }
        }
    }
}