import { Board } from "../display/Board";
import { app } from "../main";
import { getGameSession, getSelectedLevel, setGameSession, setSelectedLevel } from "../model/app";
import { GameSessionData } from "../model/GameSessionData";
import { getLevelData } from "../model/levels";
import { M3Model } from "../model/M3Model";
import { Swap } from "../model/Swap";
import { int } from "../utils/integer";
import { Context } from "./Context";
import { CreateRocks } from "./CreateRocks";
import { CreateTiles } from "./CreateTiles";
import { FadeOutBoard } from "./FadeOutBoard";
import { IdleController } from "./IdleController";
import { InitBoardPosition } from "./InitBoardPosition";
import { InitializeBoard } from "./InitializeBoard";
import { Invoke } from "./Invoke";
import { LogProcessInfo } from "./LogProcessInfo";
import { logProcessInfo, Process } from "./Process";
import { addProcess } from "./processRunner";
import { ScrollBoard } from "./ScrollBoard";

export class GameplayProcess extends Process {
    private static _ctx: Context;
    private _model!: M3Model;
    private _view!: Board;
    private _possibleSwap: Swap | null = null;

    constructor(private readonly _levelID: int) {
        super();
    }

    public static get ctx(): Context { return this._ctx }

    protected override onStart(): void {
        setSelectedLevel(getLevelData(this._levelID));
        setGameSession(new GameSessionData(getSelectedLevel()));

        this._model = new M3Model(getGameSession());
        this._view = new Board();
        app.stage.addChild(this._view);
        GameplayProcess._ctx = new Context(this._model, this._view);
        addProcess(new CreateTiles(), "gameplay");
        addProcess(new CreateRocks(), "gameplay");
        addProcess(new InitializeBoard(), "gameplay");
        addProcess(new InitBoardPosition(), "gameplay");
        addProcess(new FadeOutBoard(), "gameplay");
        addProcess(new ScrollBoard, "gameplay");
        addProcess(new Invoke(this.setupInteraction, this), "gameplay");
        addProcess(new LogProcessInfo(), "gameplay");
    }

    private setupInteraction(): void {
        this._model.sleepOutside();
        this._possibleSwap = this._model.matcher.getRandomPossibleSwap();
        if (!this._possibleSwap)
            throw new Error("no possible swap found");

        addProcess(new IdleController(this._possibleSwap), "idle", false);
    }
}