import { getSelectedLevel, setGameSession, setSelectedLevel } from "../model/app";
import { GameSessionData } from "../model/GameSessionData";
import { getLevelData } from "../model/levels";
import { int } from "../utils/integer";
import { GameProcess } from "./GameProcess";
import { Process } from "./Process";
import { addProcess } from "./processRunner";

export class StartGame extends Process {
    constructor(private readonly _levelID: int) {
        super();
    }

    protected override onStart(): void {
        // retrieving info from server
        setSelectedLevel(getLevelData(this._levelID));
        setGameSession(new GameSessionData(getSelectedLevel()));
        addProcess(new GameProcess(), "game");
    }
}