import { FederatedEvent, FederatedPointerEvent } from "pixi.js";
import { Board, getCenterAtCoordinates } from "../display/Board";
import { Selection } from "../display/Selection";
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
import { UnblockInteraction } from "./UnblockInteraction";
import { BoardObject } from "../display/BoardObject";
import { cfg } from "../game/cfg";
import { BoardCoordinates } from "../model/BoardCoordinates";

const SWAP_INTERVAL = 20;
export class GameplayProcess extends Process {
    private static _ctx: Context;
    private _model!: M3Model;
    private _view!: Board;
    private _possibleSwap: Swap | null = null;
    private _selection!: Selection;
    private _selected: BoardObject | null = null;
    private _x0: number = 0;
    private _y0: number = 0;
    // private _scoreManager:ScoreManager;

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
        addProcess(new UnblockInteraction(), "gameplay");
        addProcess(new LogProcessInfo(), "gameplay");
    }

    private setupInteraction(): void {
        this._model.sleepOutside();
        this._possibleSwap = this._model.matcher.getRandomPossibleSwap();
        if (!this._possibleSwap)
            throw new Error("no possible swap found");

        addProcess(new IdleController(this._possibleSwap), "idle", false);

        this._selection = new Selection();
        this._view.selectionContainer.addChild(this._selection);

        this._view.gemsContainer.on("pointerdown", this.gem_touchBeganHandler, this);
    }

    private getGemAtPosition(globalX: number, globalY: number): BoardObject | null {
        const column = Math.floor((globalX - this._view.movingContainer.x) / cfg.boardCellWidth);
        const row = Math.floor((globalY - this._view.movingContainer.y) / cfg.boardCellHeight);
        const gem = this._model.getGemAt(row, column, true);
        if (!gem?.isMoveableType())
            return null;
        return gem;
    }

    private moveSelectionTo(coordinates: BoardCoordinates): void {
        const center = getCenterAtCoordinates(coordinates);
        this._selection.position.set(center.x, center.y);
        this._selection.reset();
    }

    private gem_touchBeganHandler(event: FederatedPointerEvent): void {
        if (!this._model.interactionEnabled)
            return;

        const pressed = this.getGemAtPosition(event.globalX, event.globalY);
        if (!pressed)
            return;

        console.log(pressed)

        // Если нету выделенного объекта
        if (!this._selected) {
            this._selected = pressed;
            this._selection.visible = true;
            this._selection.start();
            this.moveSelectionTo(pressed.coordinates!);
            // this.addMouseMoveHandler(event.globalX, event.globalY);
            return;
        }

        // 2.1.
        // Если нажали на выделенный объект
        if (this._selected == pressed) {
            this._selection.visible = false;
            this._selection.stop();
            this._selected = null;
            return;
        }

        // 2.2.
        // Если нажали на невыделенный объект и объекты могут быть swapped
        if (this._model.swapPossible(this._selected, pressed)) {
            // this.swap(this._selected, pressed);
            return;
        }

        this._selected = pressed;
        this.moveSelectionTo(pressed.coordinates!);
        // this.addMouseMoveHandler(event.globalX, event.globalY);
    }
}