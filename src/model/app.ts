import { Signal } from "typed-signals";
import { LevelData } from "./LevelData";
import { GameSessionData } from "./GameSessionData";

let selectedLevel: LevelData;
export const onLevelSelected = new Signal<() => void>();
export function getSelectedLevel(): LevelData {
    return selectedLevel;
}
export function setSelectedLevel(level: LevelData): void {
    selectedLevel = level;
    onLevelSelected.emit();
}

let gameSession: GameSessionData;
export function setGameSession(sessionData: GameSessionData): void {
    gameSession = sessionData;
}
export function getGameSession(): GameSessionData {
    return gameSession;
}