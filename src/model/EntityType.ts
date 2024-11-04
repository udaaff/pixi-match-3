import { int } from "../utils/integer";
import { EntityID } from "./EntityID";

export enum EntityType {
    MARKER_DISABLED = "markerDisabled",
    SURFACE = "surface",
    BG_ITEM = "bgItem",
    GEM = "gem",
    ROCK = "rock",
    BOMB = "bomb",
    BLOCK = "block",
    FREEZE = "freeze",
    LOCK = "lock",
    MARKER_SPAWNER = "markerSpawner",
    MARKER_ENTRANCE = "markerEntrance",
    MARKER_EXIT = "markerExit",
    MARKER_WAY_POINT = "markerWayPoint",
    MARKER_EMPTY = "markerEmpty",
    BOSS = "boss",
    CRYSTAL = "crystal",
}

const idToType: Map<int, string> = new Map();
idToType.set(EntityID.MARKER_DISABLED, EntityType.MARKER_DISABLED);
idToType.set(EntityID.SURFACE_ROAD, EntityType.SURFACE);
idToType.set(EntityID.SURFACE_DOOR, EntityType.SURFACE);
idToType.set(EntityID.BG_ITEM_SAND_1, EntityType.BG_ITEM);
idToType.set(EntityID.BG_ITEM_SAND_2, EntityType.BG_ITEM);
idToType.set(EntityID.GEM_BLUE, EntityType.GEM);
idToType.set(EntityID.GEM_GREEN, EntityType.GEM);
idToType.set(EntityID.GEM_ORANGE, EntityType.GEM);
idToType.set(EntityID.GEM_PURPLE, EntityType.GEM);
idToType.set(EntityID.GEM_RED, EntityType.GEM);
idToType.set(EntityID.GEM_YELLOW, EntityType.GEM);
idToType.set(EntityID.ROCK_1, EntityType.ROCK);
idToType.set(EntityID.BOMB_3x3_BLUE, EntityType.BOMB);
idToType.set(EntityID.BOMB_3x3_GREEN, EntityType.BOMB);
idToType.set(EntityID.BOMB_3x3_ORANGE, EntityType.BOMB);
idToType.set(EntityID.BOMB_3x3_PURPLE, EntityType.BOMB);
idToType.set(EntityID.BOMB_3x3_RED, EntityType.BOMB);
idToType.set(EntityID.BOMB_3x3_YELLOW, EntityType.BOMB);
idToType.set(EntityID.BOMB_CROSS_BLUE, EntityType.BOMB);
idToType.set(EntityID.BOMB_CROSS_GREEN, EntityType.BOMB);
idToType.set(EntityID.BOMB_CROSS_ORANGE, EntityType.BOMB);
idToType.set(EntityID.BOMB_CROSS_PURPLE, EntityType.BOMB);
idToType.set(EntityID.BOMB_CROSS_RED, EntityType.BOMB);
idToType.set(EntityID.BOMB_CROSS_YELLOW, EntityType.BOMB);
idToType.set(EntityID.BOMB_V_LINE_BLUE, EntityType.BOMB);
idToType.set(EntityID.BOMB_V_LINE_GREEN, EntityType.BOMB);
idToType.set(EntityID.BOMB_V_LINE_ORANGE, EntityType.BOMB);
idToType.set(EntityID.BOMB_V_LINE_PURPLE, EntityType.BOMB);
idToType.set(EntityID.BOMB_V_LINE_RED, EntityType.BOMB);
idToType.set(EntityID.BOMB_V_LINE_YELLOW, EntityType.BOMB);
idToType.set(EntityID.BOMB_H_LINE_BLUE, EntityType.BOMB);
idToType.set(EntityID.BOMB_H_LINE_GREEN, EntityType.BOMB);
idToType.set(EntityID.BOMB_H_LINE_ORANGE, EntityType.BOMB);
idToType.set(EntityID.BOMB_H_LINE_PURPLE, EntityType.BOMB);
idToType.set(EntityID.BOMB_H_LINE_RED, EntityType.BOMB);
idToType.set(EntityID.BOMB_H_LINE_YELLOW, EntityType.BOMB);
idToType.set(EntityID.BOMB_COLOR, EntityType.BOMB);
idToType.set(EntityID.BLOCK_SOIL, EntityType.BLOCK);
idToType.set(EntityID.BLOCK_SOIL_KEY, EntityType.BLOCK);
idToType.set(EntityID.BLOCK_STONE_1, EntityType.BLOCK);
idToType.set(EntityID.BLOCK_STONE_2, EntityType.BLOCK);
idToType.set(EntityID.BLOCK_STONE_3, EntityType.BLOCK);
idToType.set(EntityID.BLOCK_STONE_4, EntityType.BLOCK);
idToType.set(EntityID.BLOCK_TARGET_1, EntityType.BLOCK);
idToType.set(EntityID.FREEZE_1, EntityType.FREEZE);
idToType.set(EntityID.LOCK_1, EntityType.LOCK);
idToType.set(EntityID.MARKER_ENTRANCE, EntityType.MARKER_ENTRANCE);
idToType.set(EntityID.MARKER_EXIT, EntityType.MARKER_EXIT);
idToType.set(EntityID.MARKER_EMPTY, EntityType.MARKER_EMPTY);
idToType.set(EntityID.BOSS_1, EntityType.BOSS);
idToType.set(EntityID.BOSS_2, EntityType.BOSS);
idToType.set(EntityID.BOSS_3, EntityType.BOSS);
idToType.set(EntityID.CRYSTAL_1, EntityType.CRYSTAL);
idToType.set(EntityID.CRYSTAL_2, EntityType.CRYSTAL);
idToType.set(EntityID.MARKER_WAY_POINT_1, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_2, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_3, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_4, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_5, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_6, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_7, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_8, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_9, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_WAY_POINT_10, EntityType.MARKER_WAY_POINT);
idToType.set(EntityID.MARKER_SPAWNER_1, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_2, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_3, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_4, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_5, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_6, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_7, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_8, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_9, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.MARKER_SPAWNER_10, EntityType.MARKER_SPAWNER);
idToType.set(EntityID.BOMB_3x3_ANY, EntityType.BOMB);
idToType.set(EntityID.BOMB_H_LINE_ANY, EntityType.BOMB);
idToType.set(EntityID.BOMB_V_LINE_ANY, EntityType.BOMB);

export function getEntityTypeById(id: int): string {
    const entityType = idToType.get(id);
    if (!entityType) {
        throw new Error(`Entity type not found for id: ${id}`);
    }
    return entityType;
}