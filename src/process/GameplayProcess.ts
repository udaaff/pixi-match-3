import { Board } from "../display/Board";
import { app } from "../main";
import { getGameSession, getSelectedLevel, setGameSession, setSelectedLevel } from "../model/app";
import { GameSessionData } from "../model/GameSessionData";
import { getLevelData } from "../model/levels";
import { M3Model } from "../model/M3Model";
import { int } from "../utils/integer";
import { CreateTiles } from "./CreateTiles";
import { GameProcess } from "./GameProcess";
import { Process } from "./Process";
import { addProcess } from "./processRunner";

export class GameplayProcess extends Process {
    constructor(private readonly _levelID: int) {
        super();
    }

    protected override onStart(): void {
        // retrieving info from server
        setSelectedLevel(getLevelData(this._levelID));
        setGameSession(new GameSessionData(getSelectedLevel()));
        const model = new M3Model(getGameSession());
        const view = new Board();
        app.stage.addChild(view);
        addProcess(new CreateTiles(view, model), "gameplay");
    }
}