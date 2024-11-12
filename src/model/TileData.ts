import { EntityID } from "./EntityID";
import { EntityType, getEntityTypeById } from "./EntityType";

export class TileData {
    private _spawner = -1;
    private _entrance = false;
    private _exit = false;
    private _wayPoint = -1;
    private _visible = true;
    private _empty = false;
    private _surface = EntityID.ENTITY_NONE;
    private _bgItem = EntityID.ENTITY_NONE;
    private _rock = EntityID.ENTITY_NONE;
    private _gem = EntityID.ENTITY_NONE;
    private _freeze = EntityID.ENTITY_NONE;
    private _lock = EntityID.ENTITY_NONE;
    private _block = EntityID.ENTITY_NONE;
    private _bomb = EntityID.ENTITY_NONE;
    private _crystal = EntityID.ENTITY_NONE;

    constructor(
        public readonly i: number,
        public readonly j: number,
        data: any
    ) {
        if (!Array.isArray(data))
            throw new Error("tile data must be an array");

        for (const entityID of data) {
            const entityType = getEntityTypeById(entityID);
            if (entityType == EntityType.MARKER_DISABLED)
                this._visible = false;
            else if (entityType == EntityType.SURFACE)
                this._surface = entityID;
            else if (entityType == EntityType.BLOCK)
                this._block = entityID;
            else if (entityType == EntityType.BG_ITEM)
                this._bgItem = entityID;
            else if (entityType == EntityType.GEM)
                this._gem = entityID;
            else if (entityType == EntityType.CRYSTAL)
                this._crystal = entityID;
            else if (entityType == EntityType.MARKER_WAY_POINT)
                this._wayPoint = entityID;
            else if (entityType == EntityType.FREEZE)
                this._freeze = entityID;
            else if (entityType == EntityType.LOCK)
                this._lock = entityID;
            else if (entityType == EntityType.MARKER_ENTRANCE)
                this._entrance = true;
            else if (entityType == EntityType.MARKER_EXIT)
                this._exit = true;
            else if (entityType == EntityType.MARKER_SPAWNER)
                this._spawner = entityID;
            else if (entityType == EntityType.BOMB)
                this._bomb = entityID;
            else if (entityType == EntityType.MARKER_EMPTY)
                this._empty = true;
            else if (entityType == EntityType.ROCK)
                this._rock = entityID;
        }
    }

    public get spawner() { return this._spawner; }
    public get entrance() { return this._entrance; }
    public get exit() { return this._exit; }
    public get wayPoint() { return this._wayPoint; }
    public get visible() { return this._visible; }
    public get empty() { return this._empty; }
    public get surface() { return this._surface; }
    public get bgItem() { return this._bgItem; }
    public get rock() { return this._rock; }
    public get gem() { return this._gem; }
    public get freeze() { return this._freeze; }
    public get lock() { return this._lock; }
    public get block() { return this._block; }
    public get bomb() { return this._bomb; }
    public get crystal() { return this._crystal; }
}