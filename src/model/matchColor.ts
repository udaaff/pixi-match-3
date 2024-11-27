import { int } from "../utils/integer";
import { getRandomUint } from "../utils/random";
import { EntityID } from "./EntityID";

export enum ColorType {
    UNDEFINED = -1,
    NONE = 0,
    BLUE = 1,
    GREEN = 2,
    ORANGE = 3,
    PURPLE = 4,
    RED = 5,
    YELLOW = 6,
}

const entityIDToMatchType = new Map<int, int>();
const matchTypeToCrossBombID = new Map<int, int>();
const _matchTypeTo3x3BombID = new Map<int, int>();
const _matchTypeToHBombID = new Map<int, int>();
const _matchTypeToVBombID = new Map<int, int>();

entityIDToMatchType.set(EntityID.BOMB_3x3_BLUE, ColorType.BLUE);
entityIDToMatchType.set(EntityID.BOMB_3x3_GREEN, ColorType.GREEN);
entityIDToMatchType.set(EntityID.BOMB_3x3_ORANGE, ColorType.ORANGE);
entityIDToMatchType.set(EntityID.BOMB_3x3_PURPLE, ColorType.PURPLE);
entityIDToMatchType.set(EntityID.BOMB_3x3_RED, ColorType.RED);
entityIDToMatchType.set(EntityID.BOMB_3x3_YELLOW, ColorType.YELLOW);

entityIDToMatchType.set(EntityID.BOMB_CROSS_BLUE, ColorType.BLUE);
entityIDToMatchType.set(EntityID.BOMB_CROSS_GREEN, ColorType.GREEN);
entityIDToMatchType.set(EntityID.BOMB_CROSS_ORANGE, ColorType.ORANGE);
entityIDToMatchType.set(EntityID.BOMB_CROSS_PURPLE, ColorType.PURPLE);
entityIDToMatchType.set(EntityID.BOMB_CROSS_RED, ColorType.RED);
entityIDToMatchType.set(EntityID.BOMB_CROSS_YELLOW, ColorType.YELLOW);

entityIDToMatchType.set(EntityID.BOMB_H_LINE_BLUE, ColorType.BLUE);
entityIDToMatchType.set(EntityID.BOMB_H_LINE_GREEN, ColorType.GREEN);
entityIDToMatchType.set(EntityID.BOMB_H_LINE_ORANGE, ColorType.ORANGE);
entityIDToMatchType.set(EntityID.BOMB_H_LINE_PURPLE, ColorType.PURPLE);
entityIDToMatchType.set(EntityID.BOMB_H_LINE_RED, ColorType.RED);
entityIDToMatchType.set(EntityID.BOMB_H_LINE_YELLOW, ColorType.YELLOW);

entityIDToMatchType.set(EntityID.BOMB_V_LINE_BLUE, ColorType.BLUE);
entityIDToMatchType.set(EntityID.BOMB_V_LINE_GREEN, ColorType.GREEN);
entityIDToMatchType.set(EntityID.BOMB_V_LINE_ORANGE, ColorType.ORANGE);
entityIDToMatchType.set(EntityID.BOMB_V_LINE_PURPLE, ColorType.PURPLE);
entityIDToMatchType.set(EntityID.BOMB_V_LINE_RED, ColorType.RED);
entityIDToMatchType.set(EntityID.BOMB_V_LINE_YELLOW, ColorType.YELLOW);

entityIDToMatchType.set(EntityID.GEM_BLUE, ColorType.BLUE);
entityIDToMatchType.set(EntityID.GEM_GREEN, ColorType.GREEN);
entityIDToMatchType.set(EntityID.GEM_ORANGE, ColorType.ORANGE);
entityIDToMatchType.set(EntityID.GEM_PURPLE, ColorType.PURPLE);
entityIDToMatchType.set(EntityID.GEM_RED, ColorType.RED);
entityIDToMatchType.set(EntityID.GEM_YELLOW, ColorType.YELLOW);

_matchTypeTo3x3BombID.set(ColorType.BLUE, EntityID.BOMB_3x3_BLUE);
_matchTypeTo3x3BombID.set(ColorType.GREEN, EntityID.BOMB_3x3_GREEN);
_matchTypeTo3x3BombID.set(ColorType.ORANGE, EntityID.BOMB_3x3_ORANGE);
_matchTypeTo3x3BombID.set(ColorType.PURPLE, EntityID.BOMB_3x3_PURPLE);
_matchTypeTo3x3BombID.set(ColorType.RED, EntityID.BOMB_3x3_RED);
_matchTypeTo3x3BombID.set(ColorType.YELLOW, EntityID.BOMB_3x3_YELLOW);

_matchTypeToHBombID.set(ColorType.BLUE, EntityID.BOMB_H_LINE_BLUE);
_matchTypeToHBombID.set(ColorType.GREEN, EntityID.BOMB_H_LINE_GREEN);
_matchTypeToHBombID.set(ColorType.ORANGE, EntityID.BOMB_H_LINE_ORANGE);
_matchTypeToHBombID.set(ColorType.PURPLE, EntityID.BOMB_H_LINE_PURPLE);
_matchTypeToHBombID.set(ColorType.RED, EntityID.BOMB_H_LINE_RED);
_matchTypeToHBombID.set(ColorType.YELLOW, EntityID.BOMB_H_LINE_YELLOW);

_matchTypeToVBombID.set(ColorType.BLUE, EntityID.BOMB_V_LINE_BLUE);
_matchTypeToVBombID.set(ColorType.GREEN, EntityID.BOMB_V_LINE_GREEN);
_matchTypeToVBombID.set(ColorType.ORANGE, EntityID.BOMB_V_LINE_ORANGE);
_matchTypeToVBombID.set(ColorType.PURPLE, EntityID.BOMB_V_LINE_PURPLE);
_matchTypeToVBombID.set(ColorType.RED, EntityID.BOMB_V_LINE_RED);
_matchTypeToVBombID.set(ColorType.YELLOW, EntityID.BOMB_V_LINE_YELLOW);

matchTypeToCrossBombID.set(ColorType.BLUE, EntityID.BOMB_CROSS_BLUE);
matchTypeToCrossBombID.set(ColorType.GREEN, EntityID.BOMB_CROSS_GREEN);
matchTypeToCrossBombID.set(ColorType.ORANGE, EntityID.BOMB_CROSS_ORANGE);
matchTypeToCrossBombID.set(ColorType.PURPLE, EntityID.BOMB_CROSS_PURPLE);
matchTypeToCrossBombID.set(ColorType.RED, EntityID.BOMB_CROSS_RED);
matchTypeToCrossBombID.set(ColorType.YELLOW, EntityID.BOMB_CROSS_YELLOW);

export function getRandomType(): int {
    return getRandomUint(6) + 1;
}

export function getMatchTypeByEntityID(entityID: int): int {
    return entityIDToMatchType.get(entityID) ?? ColorType.UNDEFINED;
}

export function get3x3BombIdByMatchType(matchType: int): int {
    return _matchTypeTo3x3BombID.get(matchType) ?? ColorType.UNDEFINED;
}

export function getHBombIdByMatchType(matchType: int): int {
    return _matchTypeToHBombID.get(matchType) ?? ColorType.UNDEFINED;
}

export function getVBombIdByMatchType(matchType: int): int {
    return _matchTypeToVBombID.get(matchType) ?? ColorType.UNDEFINED;
}
