import { int } from "../utils/integer";

export enum EntityID {
    ENTITY_NONE = -1,
    MARKER_DISABLED = 0,

    SURFACE_ROAD = 2,
    SURFACE_DOOR = 3,

    BG_ITEM_SAND_1 = 11,
    BG_ITEM_SAND_2 = 12,

    GEM_BLUE = 21,
    GEM_GREEN = 22,
    GEM_ORANGE = 23,
    GEM_PURPLE = 24,
    GEM_RED = 25,
    GEM_YELLOW = 26,
    // GEMS: number[] = [
    //     EntityID.GEM_BLUE,
    //     EntityID.GEM_GREEN,
    //     EntityID.GEM_ORANGE,
    //     EntityID.GEM_PURPLE,
    //     EntityID.GEM_RED,
    //     EntityID.GEM_YELLOW
    // ],

    ROCK_1 = 30,

    FREEZE_1 = 41,
    FREEZE_2 = 42, // reserved. not implemented
    FREEZE_3 = 43, // reserved. not implemented
    FREEZE_4 = 44, // reserved. not implemented

    LOCK_1 = 46,
    LOCK_2 = 47, // reserved. not implemented
    LOCK_3 = 48, // reserved. not implemented
    LOCK_4 = 49, // reserved. not implemented

    BLOCK_SOIL = 51,
    BLOCK_SOIL_KEY = 52,
    BLOCK_STONE_1 = 53,
    BLOCK_STONE_2 = 54,
    BLOCK_STONE_3 = 55,
    BLOCK_STONE_4 = 56,

    BOMB_3x3_BLUE = 61,
    BOMB_3x3_GREEN = 62,
    BOMB_3x3_ORANGE = 63,
    BOMB_3x3_PURPLE = 64,
    BOMB_3x3_RED = 65,
    BOMB_3x3_YELLOW = 66,

    BOMB_CROSS_BLUE = 67,
    BOMB_CROSS_GREEN = 68,
    BOMB_CROSS_ORANGE = 69,
    BOMB_CROSS_PURPLE = 70,
    BOMB_CROSS_RED = 71,
    BOMB_CROSS_YELLOW = 72,
    BOMB_V_LINE_BLUE = 73,
    BOMB_V_LINE_GREEN = 74,
    BOMB_V_LINE_ORANGE = 75,
    BOMB_V_LINE_PURPLE = 76,
    BOMB_V_LINE_RED = 77,
    BOMB_V_LINE_YELLOW = 78,
    BOMB_H_LINE_BLUE = 79,
    BOMB_H_LINE_GREEN = 80,
    BOMB_H_LINE_ORANGE = 81,
    BOMB_H_LINE_PURPLE = 82,
    BOMB_H_LINE_RED = 83,
    BOMB_H_LINE_YELLOW = 84,
    BOMB_COLOR = 85,

    MARKER_SPAWNER = 91,
    MARKER_ENTRANCE = 92,
    MARKER_EXIT = 93,
    MARKER_EMPTY = 95,

    BLOCK_TARGET_1 = 100,

    BOSS_1 = 120,
    BOSS_2 = 121,
    BOSS_3 = 122,

    CRYSTAL_1 = 140,
    CRYSTAL_2 = 141, // reserved. not implemented

    MARKER_WAY_POINT_1 = 150,
    MARKER_WAY_POINT_2 = 151,
    MARKER_WAY_POINT_3 = 152,
    MARKER_WAY_POINT_4 = 153,
    MARKER_WAY_POINT_5 = 154,
    MARKER_WAY_POINT_6 = 155,
    MARKER_WAY_POINT_7 = 156,
    MARKER_WAY_POINT_8 = 157,
    MARKER_WAY_POINT_9 = 158,
    MARKER_WAY_POINT_10 = 159,

    MARKER_SPAWNER_1 = 170,
    MARKER_SPAWNER_2 = 171,
    MARKER_SPAWNER_3 = 172,
    MARKER_SPAWNER_4 = 173,
    MARKER_SPAWNER_5 = 174,
    MARKER_SPAWNER_6 = 175,
    MARKER_SPAWNER_7 = 176,
    MARKER_SPAWNER_8 = 177,
    MARKER_SPAWNER_9 = 178,
    MARKER_SPAWNER_10 = 179,

    BOMB_3x3_ANY = 190,
    BOMB_V_LINE_ANY = 191,
    BOMB_H_LINE_ANY = 192,
}

export function getWayPointIndex(entityID: int): int {
    return entityID - EntityID.MARKER_WAY_POINT_1;
}

export function getSpawnerIndex(entityID: int): int {
    return entityID - EntityID.MARKER_SPAWNER_1;
}

