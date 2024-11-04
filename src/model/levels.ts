import { int } from "../utils/integer";
import { LevelData } from "./LevelData";

const idToLevelData: Map<int, LevelData> = new Map();
let rawLevelsData: []

export function setRawLevelsData(data: any): void {
    if (!Array.isArray(data.levels))
        throw new Error("levels data should be an array");

    rawLevelsData = data.levels;
}

export function getLevelData(id: int): LevelData {
    if (idToLevelData.has(id))
        return idToLevelData.get(id)!;

    const levelData = new LevelData(rawLevelsData[id]);
    idToLevelData.set(id, levelData);
    return levelData;
}
