import { int } from "../utils/integer";
import { Match } from "./Match";

export const SCORE_TARGET = 5000;
export const SCORE_MOVE = 1000;
export const SCORE_MATCH_3 = 100;
export const SCORE_MATCH_4 = 200;
export const SCORE_MATCH_5 = 500;
export const SCORE_GEM = 25;
export const SCORE_BOMB = 100;

const matchTypeToScore = new Map<string, int>();
matchTypeToScore.set(Match.MATCH_3, SCORE_MATCH_3);
matchTypeToScore.set(Match.MATCH_4, SCORE_MATCH_4);
matchTypeToScore.set(Match.MATCH_5, SCORE_MATCH_5);

const SCORE_DEFAULT = 50;

export function getScoreByMatchType(matchType: string): int {
    return matchTypeToScore.get(matchType) ?? SCORE_DEFAULT;
}