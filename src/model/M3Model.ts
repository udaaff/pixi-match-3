import { BoardObject } from "../display/BoardObject";
import { Bomb } from "../display/Bomb";
import { ColorBomb } from "../display/ColorBomb";
import { Target } from "../display/Target";
import { cfg } from "../game/cfg";
import { getRandomElement, removeRandomElement, shuffle } from "../utils/arrayUtils";
import { int, uint } from "../utils/integer";
import { getRandom } from "../utils/random";
import { BoardCoordinates } from "./BoardCoordinates";
import { GameSessionData } from "./GameSessionData";
import { LevelData } from "./LevelData";
import { Match } from "./Match";
import { ColorType, getMatchTypeByEntityID } from "./matchColor";
import { Matcher } from "./Matcher";
import { SpawnData } from "./SpawnData";
import { Swap } from "./Swap";
import { Tunnel } from "./Tunnel";
import { Viewport } from "./Viewport";

const MAX_NUMBER_OF_SHUFFLES: int = 1000;

const PATTERN = [[0, -1], [-1, 0], [0, 1], [1, 0]];

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
    public readonly levelData: LevelData;
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
    private _targets = new Map<int, Target>();

    constructor(gameSession: GameSessionData) {
        this.levelData = gameSession.levelData;
        this.matcher = new Matcher(this);
        this.boardHLength = gameSession.levelData.boardHLength;
        this.boardVLength = gameSession.levelData.boardVLength;
        this._registeredSpawners = Array.from({ length: this.boardVLength }, () => []);
        this._entrances = Array.from({ length: this.boardVLength }, () => []);
        this._exits = Array.from({ length: this.boardVLength }, () => []);
        this._entranceToTunnel = Array.from({ length: this.boardVLength }, () => []);
        this._exitToTunnel = Array.from({ length: this.boardVLength }, () => []);
        this._tiles = Array.from({ length: this.boardVLength }, () => []);
        this._gems = Array.from({ length: this.boardVLength }, () => []);
        this._freezes = Array.from({ length: this.boardVLength }, () => []);
        this._locks = Array.from({ length: this.boardVLength }, () => []);
        this._bgItems = Array.from({ length: this.boardVLength }, () => []);
        this._crystals = Array.from({ length: this.boardVLength }, () => []);
        // this.setSpawners(gameSession.levelData.spawners);
        // this.setSpawnData(gameSession.levelData.spawns);
        // this.setWayPoints(gameSession.levelData.wayPoints);
    }

    public registerTarget(target: Target): void {
        this._targets.set(target.entityID, target);
    }

    public getTargetByEntityID(entityID:int): Target | undefined{
        return this._targets.get(entityID);
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
        return !gem.isMoveableType();
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

    public swapPossible(gem1: BoardObject, gem2: BoardObject): boolean {
        if (!gem1?.isMoveableType() || !gem2?.isMoveableType())
            return false;

        if (gem1.isBlocked || this.gemFrozen(gem1) || this.gemLocked(gem1)
                || gem2.isBlocked || this.gemFrozen(gem2) || this.gemLocked(gem2))
            return false;

        const c1 = gem1.coordinates!;
        const c2 = gem2.coordinates!;
        return c1.row === c2.row && Math.abs(c1.column - c2.column) === 1
            || c1.column === c2.column && Math.abs(c1.row - c2.row) === 1;
    }

    public setWayPoints(wayPoints: BoardCoordinates[]): void {
        this._wayPoints = wayPoints;
        if (!this._wayPoints || this._wayPoints.length === 0)
            throw new Error("No waypoint are defined.");

        this.moveViewportTo(this._wayPoints[this._currentWayPointIndex]);
    }

    public moveToNextWayPoint(): void {
        this._currentWayPointIndex++;
        if (this._currentWayPointIndex === this._wayPoints.length)
            throw new Error("Next way point doesn't exist.");

        this.moveViewportTo(this._wayPoints[this._currentWayPointIndex]);
    }

    public getCurrentWayPoint(): BoardCoordinates | null {
        if (this._currentWayPointIndex === this._wayPoints.length)
            return null;

        return this._wayPoints[this._currentWayPointIndex];
    }

    public getNextWayPoint(): BoardCoordinates | null {
        let nextPointIndex:int = this._currentWayPointIndex + 1;
        if (nextPointIndex === this._wayPoints.length)
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
            if (spawnData.weight === 0)
                continue;

            this._spawns.push(spawnData);
            this._totalWeight += spawnData.weight;

            const matchType = getMatchTypeByEntityID(spawnData.type);
            if (matchType !== ColorType.UNDEFINED)
                this.spawnableMatchTypes.push(matchType);
        }
    }

    public registerTunnel(entrance: BoardCoordinates, exit: BoardCoordinates): void {
        this._entrances[entrance.row][entrance.column] = entrance;
        this._exits[exit.row][exit.column] = exit;
        let tunnel:Tunnel = new Tunnel(entrance, exit);
        this._entranceToTunnel[entrance.row][entrance.column] = tunnel;
        this._exitToTunnel[exit.row][exit.column] = tunnel;
    }

    public registerTileAt(tile: BoardObject, row: int, column: int): void {
        this._tiles[row][column] = tile;
        tile.coordinates = new BoardCoordinates(row, column);
    }

    public hasTileAt(row: int, column: int): boolean {
        if (!coordinatesInRange(row, column, this._tiles))
            return false;

        return !!(this._tiles[row][column]);
    }

    /** tile exists and has no gem on it */
    public hasFreeTileAt(row: int, column: int): boolean {
        return this.hasTileAt(row, column) && !this.hasGemAt(row, column);
    }

    public hasSpawnerAt(row: int, column: int): boolean {
        if (!coordinatesInRange(row, column, this._registeredSpawners))
            return false;

        return !!(this._registeredSpawners[row][column]);
    }

    public getShuffledSpawners(): BoardCoordinates[] {
        return shuffle(this._currentSpawners.concat());
    }

    public hasExitAt(row: int, column: int): boolean {
        if (!coordinatesInRange(row, column, this._exits))
            return false;

        return !!(this._exits[row][column]);
    }

    public getTunnelAt(row: int, column: int): Tunnel | null {
        if (!coordinatesInRange(row, column, this._entranceToTunnel))
            return null;

        return this._entranceToTunnel[row][column];
    }

    public getBGItemAt(row: int, column: int, checkViewport = false): BoardObject | null {
        if (checkViewport && !this.viewport.contains(row, column))
            return null;

        if (!coordinatesInRange(row, column, this._bgItems))
            return null;

        return this._bgItems[row][column];
    }

    public hasMatchable(matchType: int):  boolean {
        const iLength: int = this.viewport.row + this.viewport.vLength;
        const jLength: int = this.viewport.column + this.viewport.hLength;
        for (let i = this.viewport.row; i < iLength; i++) {
            for (let j = this.viewport.column; j < jLength; j++) {
                const matchable = this.getGemAt(i, j);
                if (!matchable?.isMatchableType() || matchable.isBlocked
                        || matchable.matchType !== matchType)
                    continue;

                return true;
            }
        }
        return false;
    }

    /** for color bomb */
    public getRandomSpawnableMatchType(): int {
        const availableTypes: int[] = [];
        const iLength = this.viewport.row + this.viewport.vLength;
        const jLength = this.viewport.column + this.viewport.hLength;

        outerLoop:
        for (let i = this.viewport.row; i < iLength; i++) {
            for (let j = this.viewport.column; j < jLength; j++) {
                const matchable = this.getGemAt(i, j);
                if (!matchable?.isMatchableType() || matchable.isBlocked) continue;

                // If it already exists in the array
                if (availableTypes.indexOf(matchable.matchType) !== -1) continue;

                // If valid
                if (this.spawnableMatchTypes.indexOf(matchable.matchType) === -1) continue;

                availableTypes.push(matchable.matchType);

                // All available types are already present
                if (availableTypes.length === this.spawnableMatchTypes.length)
                    break outerLoop;
            }
        }

        if (availableTypes.length === 0)
            return ColorType.NONE;

        return getRandomElement(availableTypes)!;
    }

    /** generates entityID according to defined weights */
    public spawn() {
        const r = this._totalWeight * getRandom();
        console.log(r, this._totalWeight, getRandom())
        let w = 0;
        for (let i:int = 0; i < this._spawns.length; i++) {
            w += this._spawns[i].weight;
            if (w > r)
                return this._spawns[i].type;
        }
        return -1;
    }

    /**
     * Paths are returned in strict order,
     * starting from the bottom left corner of the viewport -2
     * and ending at the top right.
     * Blocked, frozen, and locked gems are not included in the calculations.
     */
    public dropGems() {
        const paths: BoardCoordinates[][] = [];

        const i0 = this.viewport.row + this.viewport.vLength - 2;
        let iLength = this.viewport.row - 2;
        if (iLength < -1)
            iLength = -1;

        let jLength = this.viewport.column + this.viewport.hLength;
        for (let i = i0; i > iLength; i--) {
            for (let j:int = this.viewport.column; j < jLength; j++) {
                const gem = this.getGemAt(i, j);
                if (!gem?.isMoveableType() || this.gemFrozen(gem) || this.gemLocked(gem))
                    continue;

                const path = this.getDropPath(gem.coordinates!);
                if (!path)
                    continue;

                paths.push(path);
                let destination = path[path.length - 1];
                this.registerGemAt(gem, destination.row, destination.column);
            }
        }

        return paths;
    }

    public getDropPath(coordinates:BoardCoordinates): BoardCoordinates[] | null {
        let wasSlide: boolean;
        let prevPathPoint = coordinates.clone();
        let nextPathPoint = this.tryDropItemFrom(prevPathPoint);

        wasSlide = !nextPathPoint.alignedWith(prevPathPoint);

        const path = [prevPathPoint];

        // while next coord differs from prev
        while (!nextPathPoint.equalsTo(prevPathPoint)) {
            let prevPushedPath:BoardCoordinates;
            if (path.length > 0 && !wasSlide) {
                prevPushedPath = path[path.length - 1];
                // drop unneeded points
                if (prevPushedPath.column === nextPathPoint.column)
                    path.pop();
            }

            wasSlide = !nextPathPoint.alignedWith(prevPathPoint);

            path.push(nextPathPoint.clone());
            prevPathPoint = nextPathPoint;
            nextPathPoint = this.tryDropItemFrom(nextPathPoint);
        }

        if (nextPathPoint.equalsTo(coordinates))
            return null;

        return path;
    }

    private tryDropItemFrom(coordinates: BoardCoordinates): BoardCoordinates {
        let newCoordinates = this.tryDropIntoTunnelFrom(coordinates);

        // if remaining in place, try to fall down
        if (newCoordinates.equalsTo(coordinates))
            newCoordinates = this.tryDropDownFrom(coordinates);

        // if remaining in place, try to fall diagonally
        if (newCoordinates.equalsTo(coordinates))
            newCoordinates = this.trySlideFrom(coordinates);

        return newCoordinates;
    }

    private tryDropIntoTunnelFrom(tileCoordinates: BoardCoordinates): BoardCoordinates {
        const tunnel = this.getTunnelAt(tileCoordinates.row, tileCoordinates.column);
        if (!tunnel)
            return tileCoordinates;

        const exit = tunnel.exit;
        if (exit.row > this.viewport.row + this.viewport.vLength - 1)
            return tileCoordinates;

        if (this.hasFreeTileAt(exit.row, exit.column))
            return exit;

        return tileCoordinates;
    }

    private tryDropDownFrom(coordinates: BoardCoordinates): BoardCoordinates {
        const itemRow = coordinates.row;
        const itemColumn = coordinates.column;
        let row = itemRow + 1;
        let newCoordinates = coordinates.clone();

        // as long as the next tile below is free for falling
        while (this.hasFreeTileAt(row, itemColumn)
                && row < this.viewport.row + this.viewport.vLength) {
            newCoordinates.row = row;
            row++;
        }

        return newCoordinates;
    }

    private trySlideFrom(itemCoordinates: BoardCoordinates): BoardCoordinates {
        const newCoordinates = this.getValidDiagonalDropCoordinates(itemCoordinates.row, itemCoordinates.column);
        if (newCoordinates)
            return newCoordinates;

        return itemCoordinates;
    }

    private getValidDiagonalDropCoordinates(row: uint, column: uint): BoardCoordinates | null {
        const leftColumn = column - 1;
        const rightColumn = column + 1;
        const nextRow = row + 1;

        if (this.tileIsFreeForSliding(nextRow, leftColumn))
            return new BoardCoordinates(nextRow, leftColumn);

        if (this.tileIsFreeForSliding(nextRow, rightColumn))
            return new BoardCoordinates(nextRow, rightColumn);

        return null;
    }

    private tileIsFreeForSliding(row: int, column: int): boolean {
        return this.hasTileAt(row, column) &&
            !this.hasGemAt(row, column) &&
            !this.hasSpawnerAt(row, column) &&
            this.positionIsValidForSliding(row, column);
    }

    private positionIsValidForSliding(row:int, column:int): boolean {
        let currentRow = row - 1;

        // go up row by row until the viewport ends
        const row0 = this.viewport.row - 2;
        while (currentRow > row0) {
            // if there is not cell above object
            if (!this.hasTileAt(currentRow, column))
                return true;

            if (this.hasNotMoveableGemAt(currentRow, column))
                return true;

            if (this.hasFreezeAt(currentRow, column) || this.hasLockAt(currentRow, column))
                return true;

            if (this.hasSpawnerAt(currentRow, column))
                return false;

            if (this.hasGemAt(currentRow, column))
                return false;

            if (this.hasExitAt(currentRow, column)) {
                const tunnel = this._exitToTunnel[currentRow][column];
                const entrance = tunnel.entrance;
                currentRow = entrance.row;
                continue;
            }
            currentRow--;
        }
        return true;
    }

    public shuffle(): BoardObject[] {
        const coordinates: BoardCoordinates[] = [];
        const gems: BoardObject[] = [];
        const iLength = this.viewport.row + this.viewport.vLength;
        const jLength = this.viewport.column + this.viewport.hLength;
        for (let i = this.viewport.row; i < iLength; i++) {
            for (let j = this.viewport.column; j < jLength; j++)
            {
                const gem = this.getGemAt(i, j);
                if (gem?.isMoveableType() && !gem.isBlocked && !this.gemFrozen(gem) && !this.gemLocked(gem)) {
                    gems.push(gem);
                    coordinates.push((gem).coordinates!.clone());
                }
            }
        }

        let n = 0;
        do {
            if (++n === MAX_NUMBER_OF_SHUFFLES)
                throw new Error("Reached max number of shuffles");

            shuffle(coordinates);
            for (let i = 0; i < coordinates.length; i++) {
                this.registerGemAt(gems[i], coordinates[i].row, coordinates[i].column);
            }
        }
        while (!this.matcher.hasMove() || this.matcher.hasMatch());

        return gems;
    }

    public registerFreezeAt(freeze: BoardObject, row: int, column: int):void {
        this._freezes[row][column] = freeze;
        freeze.coordinates = new BoardCoordinates(row, column);
    }

    public unregisterFreeze(freeze: BoardObject): void {
        delete this._freezes[freeze.coordinates!.row][freeze.coordinates!.column];
        freeze.coordinates = null;
    }

    public getFreezeAt(row: int, column: int, checkViewport = false): BoardObject | null {
        if (checkViewport && !this.viewport.contains(row, column))
            return null;

        if (!coordinatesInRange(row, column, this._freezes))
            return null;

        return this._freezes[row][column];
    }

    public registerLockAt(lock: BoardObject, row: int, column: int): void {
        this._locks[row][column] = lock;
        lock.coordinates = new BoardCoordinates(row, column);
    }

    public unregisterLock(lock: BoardObject): void {
        delete this._locks[lock.coordinates!.row][lock.coordinates!.column];
        lock.coordinates = null;
    }

    public getLockAt(row: int, column: int, checkViewport = false): BoardObject | null
    {
        if (checkViewport && !this.viewport.contains(row, column))
            return null;

        if (!coordinatesInRange(row, column, this._locks))
            return null;

        return this._locks[row][column];
    }

    public registerCrystalAt(crystal: BoardObject, row: int, column: int): void {
        this._crystals[row][column] = crystal;
        crystal.coordinates = new BoardCoordinates(row, column);
    }

    public unregisterCrystal(crystal: BoardObject): void {
        delete this._crystals[crystal.coordinates!.row][crystal.coordinates!.column];
        crystal.coordinates = null;
    }

    public getCrystalAt(row: int, column: int, checkViewport = false): BoardObject | null {
        if (checkViewport && !this.viewport.contains(row, column))
            return null;

        if (!coordinatesInRange(row, column, this._crystals))
            return null;

        return this._crystals[row][column];
    }

    public hasCrystalAt(row: int, column: int): boolean {
        if (!coordinatesInRange(row, column, this._crystals))
            return false;

        return !!(this._crystals[row][column]);
    }

    public hasKeyAt(row: int, column: int): boolean {
        let key = this.getGemAt(row, column);
        if (key?.isKey && !key.isBlocked && this.getTargetByEntityID(key.entityID))
            return true;

        key = this.getCrystalAt(row, column);
        if (key?.isKey && !key.isBlocked && this.getTargetByEntityID(key.entityID))
            return true;

        return false;
    }

    public registerBGItemAt(bgItem: BoardObject, row:int, column:int): void {
        this._bgItems[row][column] = bgItem;
        bgItem.coordinates = new BoardCoordinates(row, column);
    }

    public unregisterBGItem(bgItem: BoardObject): void {
        delete this._bgItems[bgItem.coordinates!.row][bgItem.coordinates!.column];
        bgItem.coordinates = null;
    }

    public getAutoBomb(): BoardObject | null{
        const autoBombs: Bomb[] = [];
        const iLength:int = this.viewport.row + this.viewport.vLength;
        const jLength:int = this.viewport.column + this.viewport.hLength;
        for (let i:int = this.viewport.row; i < iLength; i++) {
            for (let j:int = this.viewport.column; j < jLength; j++) {
                const bomb = this.getGemAt(i, j);
                if ((bomb instanceof Bomb) && !bomb.isBlocked && bomb.isAuto)
                    autoBombs.push(bomb);
            }
        }
        return getRandomElement(autoBombs);
    }

    public currentKeysDone(): boolean {
        const iLength = this.viewport.row + this.viewport.vLength;
        const jLength = this.viewport.column + this.viewport.hLength;
        for (let i = this.viewport.row; i < iLength; i++) {
            for (let j = this.viewport.column; j < jLength; j++) {
                let key = this.getGemAt(i, j);
                if (key?.isKey && !key.isBlocked && this.getTargetByEntityID(key.entityID))
                    return false;

                key = this.getCrystalAt(i, j);
                if (key?.isKey && !key.isBlocked && this.getTargetByEntityID(key.entityID))
                    return false;
            }
        }
        return true;
    }

    public extractAffectables(matches: Match[]): BoardObject[] {
        const result: BoardObject[] = [];
        const objectToTrueMap = new Map<BoardObject, boolean>();

        for (const match of matches) {
            for (const gem of match.gems) {
                if (this.gemFrozen(gem))
                    continue;

                const column = gem.coordinates!.column;
                const row = gem.coordinates!.row;
                for (let i = 0; i < 4; i++) {
                    const object = this.getUnblockedAffectableAt(
                        row + PATTERN[i][0], column + PATTERN[i][1]);
                    if (!object)
                        continue;

                    if (objectToTrueMap.has(object))
                        continue;

                    result.push(object);
                    objectToTrueMap.set(object, true);
                }
            }
        }
        return result;
    }

    public getUnblockedAffectableAt(row: int, column: int): BoardObject | null {
        let object = this.getLockAt(row, column, true);
        if (object?.isAffectable && !object.isBlocked)
            return object;

        object = this.getGemAt(row, column, true);
        if (object?.isAffectable && !object.isBlocked)
            return object;

        return null;
    }

    public getAffectablesByObject(object: BoardObject): BoardObject[] {
        const result: BoardObject[] = [];
        const column = object.coordinates!.column;
        const row = object.coordinates!.row;
        for (let i = 0; i < 4; i++) {
            const affectable = this.getUnblockedAffectableAt(row + PATTERN[i][0], column + PATTERN[i][1]);
            if (affectable)
                result.push(affectable);
        }
        return result;
    }

    public gemFrozen(gem: BoardObject): boolean {
        if (!gem.coordinates) return false;

        return this._freezes[gem.coordinates.row][gem.coordinates.column]?.isFreeze ?? false;
    }

    public gemLocked(gem: BoardObject): boolean {
        if (!gem.coordinates) return false;

        return this._locks[gem.coordinates.row][gem.coordinates.column]?.isLock ?? false;
    }

    public hasFreezeAt(row:int, column:int): boolean {
        return this._freezes[row][column]?.isFreeze ?? false;
    }

    public hasLockAt(row: int, column: int): boolean {
        return this._locks[row][column]?.isLock ?? false;
    }

    public hasBomb(): boolean {
        const iLength:int = this.viewport.row + this.viewport.vLength;
        const jLength:int = this.viewport.column + this.viewport.hLength;
        for (let i = this.viewport.row; i < iLength; i++)
        {
            for (let j = this.viewport.column; j < jLength; j++)
            {
                const bomb = this.getGemAt(i, j);
                if (bomb instanceof Bomb && !bomb.isBlocked)
                    return true;
            }
        }
        return false;
    }

    public getLastBomb(): BoardObject | null {
        const lastBombs: Bomb[] = [];
        const iLength:int = this.viewport.row + this.viewport.vLength;
        const jLength:int = this.viewport.column + this.viewport.hLength;
        for (let i = this.viewport.row; i < iLength; i++) {
            for (let j = this.viewport.column; j < jLength; j++) {
                const bomb = this.getGemAt(i, j);
                if (bomb instanceof Bomb && !bomb.isBlocked && bomb.isLast)
                    lastBombs.push(bomb);
            }
        }
        return getRandomElement(lastBombs);
    }

    public getLastBombs(): Bomb[] {
        const lastBombs: Bomb[] = [];
        const iLength = this.viewport.row + this.viewport.vLength;
        const jLength = this.viewport.column + this.viewport.hLength;
        for (let i = this.viewport.row; i < iLength; i++) {
            for (let j = this.viewport.column; j < jLength; j++) {
                const bomb = this.getGemAt(i, j);
                if ((bomb instanceof Bomb) && !bomb.isBlocked && bomb.isLast) {
                    lastBombs.push(bomb);
                }
            }
        }
        return lastBombs;
    }

    public getRandomMatchables(numMatchables: int): BoardObject[] {
        const matchables: BoardObject[] = [];
        const iLength:int = this.viewport.row + this.viewport.vLength;
        const jLength:int = this.viewport.column + this.viewport.hLength;
        for (let i:int = this.viewport.row; i < iLength; i++) {
            for (let j:int = this.viewport.column; j < jLength; j++) {
                const matchable = this.getGemAt(i, j);
                if (matchable?.isMatchableType() && !matchable.isBlocked
                        && !this.gemFrozen(matchable) && !this.gemLocked(matchable))
                    matchables.push(matchable);
            }
        }

        if (matchables.length < numMatchables)
            numMatchables = matchables.length;

        const random: BoardObject[] = [];
        for (let i = 0; i < numMatchables; i++) {
            random.push(removeRandomElement(matchables));
        }

        return random;
    }

    public getRandomGemWithEye(...exclude: BoardObject[]): BoardObject | null {
        const matchables: BoardObject[] = [];
        const iLength = this.viewport.row + this.viewport.vLength;
        const jLength = this.viewport.column + this.viewport.hLength;
        for (let i = this.viewport.row; i < iLength; i++) {
            for (let j:int = this.viewport.column; j < jLength; j++) {
                const havingEye = this.getGemAt(i, j);
                if (!havingEye?.isEyeType() || exclude.includes(havingEye))
                    continue;

                if (havingEye && !havingEye.isBlocked && !this.gemFrozen(havingEye)
                        && !this.gemLocked(havingEye))
                    matchables.push(havingEye);
            }
        }

        return getRandomElement(matchables);
    }

    public extractBombs(): BoardObject[] {
        const bombs: BoardObject[] = [];
        const iLength:int = this.viewport.row + this.viewport.vLength;
        const jLength:int = this.viewport.column + this.viewport.hLength;
        for (let i:int = this.viewport.row; i < iLength; i++) {
            for (let j:int = this.viewport.column; j < jLength; j++) {
                const bomb = this.getGemAt(i, j);
                if (bomb instanceof Bomb && !bomb.isBlocked)
                    bombs.push(bomb);
            }
        }
        return bombs;
    }

    public sleepOutside(): void {
        for (let i = this.boardVLength - 1; i > -1; i--) {
            for (let j = this.boardHLength - 1; j > -1; j--) {
                let object = this.getGemAt(i, j);
                if (object?.isSleepableType()) {
                    if (this.viewport.contains(i, j))
                        continue;

                    object.sleep();
                }
            }
        }
    }

    // as soon as the new viewport is set (before starting movement),
    // call this method
    public wakeUpInside(): void {
        const iLength = this.viewport.row + this.viewport.vLength;
        const jLength = this.viewport.column + this.viewport.hLength;
        for (let i:int = this.viewport.row; i < iLength; i++) {
            for (let j:int = this.viewport.column; j < jLength; j++) {
                const object = this.getGemAt(i, j);
                if (object?.isSleepableType())
                    object.wakeUp();
            }
        }
    }

    public extractBombsFromMatches(matches: Match[]): BoardObject[] {
        const result: BoardObject[] = [];
        for (const match of matches) {
            for (const gem of match.gems) {
                if (gem instanceof Bomb && !this.gemFrozen(gem) && !this.gemLocked(gem))
                    result.push(gem);
            }
        }
        return result;
    }

    public getRightmostPosition(row: int, column: int): BoardCoordinates | null {
        if (!this.viewport.contains(row, column))
            return null;

        const coordinates = new BoardCoordinates(row, column);
        const jLength = this.viewport.column + this.viewport.hLength;
        for (let j = column + 1; j < jLength; j++) {
            if (this.hasTileAt(row, j))
                coordinates.column = j;
        }
        return coordinates;
    }

    public getLeftmostPosition(row: int, column: int): BoardCoordinates | null {
        if (!this.viewport.contains(row, column))
            return null;

        const coordinates = new BoardCoordinates(row, column);
        const jLength = this.viewport.column - 1;
        for (let j = column - 1; j > jLength; j--) {
            if (this.hasTileAt(row, j))
                coordinates.column = j;
        }
        return coordinates;
    }

    public getTopmostPosition(row: int, column: int): BoardCoordinates | null
    {
        if (!this.viewport.contains(row, column))
            return null;

        const coordinates = new BoardCoordinates(row, column);
        const iLength = this.viewport.row - 1;
        for (let i = row - 1; i > iLength; i--) {
            if (this.hasTileAt(i, column))
                coordinates.row = i;
        }
        return coordinates;
    }

    public getTopmostLeftPosition(row: int, column: int): BoardCoordinates | null {
        if (!this.viewport.contains(row, column))
            return null;

        const coordinates = new BoardCoordinates(row, column);
        const iLength = this.viewport.row - 1;
        for (let i = row - 1, j = column - 1; i > iLength; i--, j--) {
            if (j < this.viewport.column)
                break;

            if (this.hasTileAt(i, j)) {
                coordinates.row = i;
                coordinates.column = j;
            }
        }
        return coordinates;
    }

    public getTopmostRightPosition(row: int, column: int):BoardCoordinates | null {
        if (!this.viewport.contains(row, column))
            return null;

        const coordinates = new BoardCoordinates(row, column);
        const iLength = this.viewport.row - 1;
        for (let i = row - 1, j = column + 1; i > iLength; i--, j++) {
            if (j > this.viewport.rightColumn)
                break;

            if (this.hasTileAt(i, j)) {
                coordinates.row = i;
                coordinates.column = j;
            }
        }
        return coordinates;
    }

    public getLowermostPosition(row: int, column: int): BoardCoordinates | null {
        if (!this.viewport.contains(row, column))
            return null;

        let coordinates:BoardCoordinates = new BoardCoordinates(row, column);
        let iLength:int = this.viewport.row + this.viewport.vLength;
        for (let i = row + 1; i < iLength; i++) {
            if (this.hasTileAt(i, column))
                coordinates.row = i;
        }
        return coordinates;
    }

    public getLowermostLeftPosition(row: int, column: int): BoardCoordinates | null {
        if (!this.viewport.contains(row, column))
            return null;

        const coordinates = new BoardCoordinates(row, column);
        const iLength = this.viewport.row + this.viewport.vLength;
        for (let i = row + 1, j = column - 1; i < iLength; i++, j--) {
            if (j < this.viewport.column)
                break;

            if (this.hasTileAt(i, j)) {
                coordinates.row = i;
                coordinates.column = j;
            }
        }
        return coordinates;
    }

    public getLowermostRightPosition(row:int, column:int):BoardCoordinates | null {
        if (!this.viewport.contains(row, column))
            return null;

        const coordinates = new BoardCoordinates(row, column);
        const iLength = this.viewport.row + this.viewport.vLength;
        for (let i = row + 1, j = column + 1; i < iLength; i++, j++) {
            if (j > this.viewport.rightColumn)
                break;

            if (this.hasTileAt(i, j)) {
                coordinates.row = i;
                coordinates.column = j;
            }
        }
        return coordinates;
    }

    // Returns unblocked (!isBlocked) objects within the viewport that match the specified MatchType.
    public getMatchablesByMatchType(matchType:int, viewport?: Viewport): BoardObject[] {
        if (!viewport)
            viewport = this.viewport;

        const iLength = viewport.row + viewport.vLength;
        const jLength = viewport.column + viewport.hLength;
        const result: BoardObject[] = [];
        for (let i = viewport.row; i < iLength; i++) {
            for (let j = viewport.column; j < jLength; j++) {
                const gem = this.getGemAt(i, j);
                if (!gem?.isMatchableType())
                    continue;

                if (gem && gem.matchType === matchType && !gem.isBlocked)
                    result.push(gem);
            }
        }
        return result;
    }
}