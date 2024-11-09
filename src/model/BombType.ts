import { int } from "../utils/integer";
import { EntityID } from "./EntityID";

export enum BombType {
    NEUTRALIZED = 0,
    CROSS = 1,
    COLOR = 2,
    SQUARE_3x3 = 3,
    DOUBLE_SQUARE = 4,
    DOUBLE_CROSS = 5,
    VERTICAL = 6,
    HORIZONTAL = 7,
    COLOR_CROSS = 8,
    COLOR_SQUARE = 9,
    COLOR_HORIZONTAL_OR_VERTICAL = 10,
    SQUARE_5x5 = 11,
    CROSS_SQUARE = 12,
}

const idToTypeMap = new Map<int, int>();
const gemIdToCrossBombId = new Map<int, int>();
const gemIdTo3x3BombId = new Map<int, int>();

idToTypeMap.set(EntityID.BOMB_3x3_BLUE, BombType.SQUARE_3x3);
idToTypeMap.set(EntityID.BOMB_3x3_GREEN, BombType.SQUARE_3x3);
idToTypeMap.set(EntityID.BOMB_3x3_ORANGE, BombType.SQUARE_3x3);
idToTypeMap.set(EntityID.BOMB_3x3_PURPLE, BombType.SQUARE_3x3);
idToTypeMap.set(EntityID.BOMB_3x3_RED, BombType.SQUARE_3x3);
idToTypeMap.set(EntityID.BOMB_3x3_YELLOW, BombType.SQUARE_3x3);
idToTypeMap.set(EntityID.BOMB_3x3_ANY, BombType.SQUARE_3x3);
idToTypeMap.set(EntityID.BOMB_CROSS_BLUE, BombType.CROSS);
idToTypeMap.set(EntityID.BOMB_CROSS_GREEN, BombType.CROSS);
idToTypeMap.set(EntityID.BOMB_CROSS_ORANGE, BombType.CROSS);
idToTypeMap.set(EntityID.BOMB_CROSS_PURPLE, BombType.CROSS);
idToTypeMap.set(EntityID.BOMB_CROSS_RED, BombType.CROSS);
idToTypeMap.set(EntityID.BOMB_CROSS_YELLOW, BombType.CROSS);
idToTypeMap.set(EntityID.BOMB_H_LINE_BLUE, BombType.HORIZONTAL);
idToTypeMap.set(EntityID.BOMB_H_LINE_GREEN, BombType.HORIZONTAL);
idToTypeMap.set(EntityID.BOMB_H_LINE_ORANGE, BombType.HORIZONTAL);
idToTypeMap.set(EntityID.BOMB_H_LINE_PURPLE, BombType.HORIZONTAL);
idToTypeMap.set(EntityID.BOMB_H_LINE_RED, BombType.HORIZONTAL);
idToTypeMap.set(EntityID.BOMB_H_LINE_YELLOW, BombType.HORIZONTAL);
idToTypeMap.set(EntityID.BOMB_H_LINE_ANY, BombType.HORIZONTAL);
idToTypeMap.set(EntityID.BOMB_V_LINE_BLUE, BombType.VERTICAL);
idToTypeMap.set(EntityID.BOMB_V_LINE_GREEN, BombType.VERTICAL);
idToTypeMap.set(EntityID.BOMB_V_LINE_ORANGE, BombType.VERTICAL);
idToTypeMap.set(EntityID.BOMB_V_LINE_PURPLE, BombType.VERTICAL);
idToTypeMap.set(EntityID.BOMB_V_LINE_RED, BombType.VERTICAL);
idToTypeMap.set(EntityID.BOMB_V_LINE_YELLOW, BombType.VERTICAL);
idToTypeMap.set(EntityID.BOMB_V_LINE_ANY, BombType.VERTICAL);
idToTypeMap.set(EntityID.BOMB_COLOR, BombType.COLOR);

gemIdTo3x3BombId.set(EntityID.GEM_BLUE, EntityID.BOMB_3x3_BLUE);
gemIdTo3x3BombId.set(EntityID.GEM_GREEN, EntityID.BOMB_3x3_GREEN);
gemIdTo3x3BombId.set(EntityID.GEM_ORANGE, EntityID.BOMB_3x3_ORANGE);
gemIdTo3x3BombId.set(EntityID.GEM_PURPLE, EntityID.BOMB_3x3_PURPLE);
gemIdTo3x3BombId.set(EntityID.GEM_RED, EntityID.BOMB_3x3_RED);
gemIdTo3x3BombId.set(EntityID.GEM_YELLOW, EntityID.BOMB_3x3_YELLOW);

gemIdToCrossBombId.set(EntityID.GEM_BLUE, EntityID.BOMB_CROSS_BLUE);
gemIdToCrossBombId.set(EntityID.GEM_GREEN, EntityID.BOMB_CROSS_GREEN);
gemIdToCrossBombId.set(EntityID.GEM_ORANGE, EntityID.BOMB_CROSS_ORANGE);
gemIdToCrossBombId.set(EntityID.GEM_PURPLE, EntityID.BOMB_CROSS_PURPLE);
gemIdToCrossBombId.set(EntityID.GEM_RED, EntityID.BOMB_CROSS_RED);
gemIdToCrossBombId.set(EntityID.GEM_YELLOW, EntityID.BOMB_CROSS_YELLOW);

export function getTypeByID(entityID: int): int {
    return idToTypeMap.get(entityID) ?? EntityID.ENTITY_NONE;
}