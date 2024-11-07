import { BoardObject } from "../display/BoardObject";
import { Bomb } from "../display/Bomb";
import { ColorBomb } from "../display/ColorBomb";
import { cfg } from "../game/cfg";
import { int } from "../utils/integer";
import { BoardCoordinates } from "./BoardCoordinates";
import { GameSessionData } from "./GameSessionData";
import { Matcher } from "./Matcher";
import { SpawnData } from "./SpawnData";
import { Swap } from "./Swap";
import { Tunnel } from "./Tunnel";
import { Viewport } from "./Viewport";

const MAX_NUMBER_OF_SHUFFLES: int = 1000;

export function coordinatesInRange(row:int, column:int, field: any[][]): boolean {
    return (row > -1 && row < field.length)
        && (column > -1 && column < field[row].length);
}

export class M3Model {
    public readonly matcher: Matcher;
    public readonly boardVLength: int;
    public readonly boardHLength: int;
    public readonly viewport: Viewport = new Viewport(cfg.viewportVLength, cfg.viewportHLength);
    public readonly spawnableMatchTypes: int[] = [];
    private readonly _registeredSpawners: BoardCoordinates[][];
    private readonly _entrances: BoardCoordinates[][];
    private readonly _exits: BoardCoordinates[][];
    private readonly _entranceToTunnel: Tunnel[][];
    private readonly _exitToTunnel: Tunnel[][];
    private readonly _tiles: BoardObject[][];
    private readonly _gems: BoardObject[][];
    private readonly _freezes: BoardObject[][];
    private readonly _locks: BoardObject[][];
    private readonly _bgItems: BoardObject[][];
    private readonly _crystals: BoardObject[][];
    private readonly _spawns: SpawnData[] = []
    private _currentWayPointIndex: int = 0;
    private _totalWeight: number = 0;
    private _wayPoints!: BoardCoordinates[];
    private _currentSpawners!: BoardCoordinates[];
    private _spawners!: BoardCoordinates[][];

    constructor(gameSession: GameSessionData) {
        this.matcher = new Matcher(this);
        this.boardHLength = gameSession.levelData.boardHLength;
        this.boardVLength = gameSession.levelData.boardVLength;
        this._registeredSpawners = new Array(this.boardVLength).fill([]);
        this._entrances = new Array(this.boardVLength).fill([]);
        this._exits = new Array(this.boardVLength).fill([]);
        this._entranceToTunnel = new Array(this.boardVLength).fill([]);
        this._exitToTunnel = new Array(this.boardVLength).fill([]);
        this._tiles = new Array(this.boardVLength).fill([]);
        this._gems = new Array(this.boardVLength).fill([]);
        this._freezes = new Array(this.boardVLength).fill([]);
        this._locks = new Array(this.boardVLength).fill([]);
        this._bgItems = new Array(this.boardVLength).fill([]);
        this._crystals = new Array(this.boardVLength).fill([]);
        this.setSpawners(gameSession.levelData.spawners);
        this.setSpawnData(gameSession.levelData.spawns);
        this.setWayPoints(gameSession.levelData.wayPoints);
    }

    public registerGemAt(gem: BoardObject, row: int, column: int): void {
        this.unregisterGem(gem);
        this.unregisterGemAt(row, column);

        this._gems[row][column] = gem;
        gem.coordinates = new BoardCoordinates(row, column);
    }

    public unregisterGemAt(row:int, column:int):void {
        const gem = this.getGemAt(row, column);
        if (!gem)
            return;

        delete this._gems[row][column];
        gem.coordinates = null;
    }

    public unregisterGem(gem: BoardObject):void {
        if (!gem.coordinates)
            return;

        delete this._gems[gem.coordinates.row][gem.coordinates.column];
        gem.coordinates = null;
    }

    public getGemAt(row:int, column:int, checkViewport: boolean = false): BoardObject | null {
        if (checkViewport && !this.viewport.contains(row, column))
            return null;

        if (!coordinatesInRange(row, column, this._gems))
            return null;

        return this._gems[row][column];
    }

    public hasGemAt(row:int, column:int): boolean {
        if (!coordinatesInRange(row, column, this._gems))
            return false;

        return !!(this._gems[row][column]);
    }

    public hasNotMoveableGemAt(row:int, column:int): boolean {
        const gem = this.getGemAt(row, column);
        if (!gem)
            return false;
        return !gem.isMoveable;
    }

    public trySwap(object1: BoardObject, object2: BoardObject): Swap | null {
        this.swap(object1, object2);

        const hasResult = (object1 instanceof Bomb && object2 instanceof Bomb)
            || object1 instanceof ColorBomb || object2 instanceof ColorBomb
            || this.matcher.hasMatch();

        if (hasResult)
            return new Swap(object1, object2);

        this.swap(object1, object2);
        return null
    }

    public swap(object1: BoardObject, object2: BoardObject): void {
        if (!object1.coordinates || !object2.coordinates)
            throw new Error("BoardObject doesn't have coordinates")

        const object1Row = object1.coordinates.row;
        const object1Column = object1.coordinates.column;

        this.registerGemAt(object1, object2.coordinates.row, object2.coordinates.column);
        this.registerGemAt(object2, object1Row, object1Column);
    }

    public setWayPoints(wayPoints: BoardCoordinates[]): void {
        this._wayPoints = wayPoints;
        if (!this._wayPoints || this._wayPoints.length == 0)
            throw new Error("No waypoint are defined.");

        this.moveViewportTo(this._wayPoints[this._currentWayPointIndex]);
    }

    public moveToNextWayPoint(): void {
        this._currentWayPointIndex++;
        if (this._currentWayPointIndex == this._wayPoints.length)
            throw new Error("Next way point doesn't exist.");

        this.moveViewportTo(this._wayPoints[this._currentWayPointIndex]);
    }

    public getCurrentWayPoint(): BoardCoordinates | null {
        if (this._currentWayPointIndex == this._wayPoints.length)
            return null;

        return this._wayPoints[this._currentWayPointIndex];
    }

    public getNextWayPoint(): BoardCoordinates | null {
        var nextPointIndex:int = this._currentWayPointIndex + 1;
        if (nextPointIndex == this._wayPoints.length)
            return null;

        return this._wayPoints[nextPointIndex];
    }

    private moveViewportTo(wayPoint:BoardCoordinates): void {
        this.viewport.row = wayPoint.row;
        this.viewport.column = wayPoint.column;
        this.updateCurrentSpawners();
    }

    private updateCurrentSpawners(): void {
        // delete those are set
        for (const spawner of this._currentSpawners) {
            delete this._registeredSpawners[spawner.row][spawner.column];
        }

        this._currentSpawners = this._spawners[this._currentWayPointIndex];
        for (const spawner of this._currentSpawners) {
            this.registerSpawner(spawner);
        }
    }

    public setSpawners(spawners: BoardCoordinates[][]): void {
        this._spawners = spawners;
        this._currentSpawners = spawners[0];
        for (const spawner of this._currentSpawners) {
            this.registerSpawner(spawner);
        }
    }

    public registerSpawner(coordinates: BoardCoordinates): void {
        this._registeredSpawners[coordinates.row][coordinates.column] = coordinates;
    }

    public hasFreeSpawner(): boolean {
        for (const spawner of this._currentSpawners) {
            if (this.hasFreeTileAt(spawner.row, spawner.column))
                return true;
        }
        return false;
    }

    /** To generate type deneding on elements weight */
    public setSpawnData(spawns: SpawnData[]): void {
        this._totalWeight = 0;

        for (const spawnData of spawns) {
            if (spawnData.weight == 0)
                continue;

            this._spawns.push(spawnData);
            this._totalWeight += spawnData.weight;

            const matchType = MatchType.getMatchTypeByEntityID(spawnData.type);
            if (matchType != MatchType.UNDEFINED)
                this._spawnableMatchTypes.push(matchType);
        }
    }
}