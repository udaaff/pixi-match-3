import { Container, Sprite } from "pixi.js";
import { TweenProcess } from "../process/TweenProcess";
import { cfg } from "../game/cfg";

export class Selection extends Container {
    private _selection: Sprite;
    private _process: TweenProcess;
    constructor() {
        super();

        this._selection = Sprite.from("board/selection");
        this._selection.pivot.set(0.5);
        this._selection.anchor.set(0.5);
        this._selection.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
        this._selection.alpha = 0;
        super.addChild(this._selection);

        this._process = new TweenProcess(this._selection, {
            duration: 0.6,
            alpha: 1,
            yoyo: true,
            repeat: -1
        });
    }

    public start(): void {
        this._selection.alpha = 0;
        this._process.start();
    }

    public stop(): void {
        this._process.stop();
    }

    public reset(): void {
        this._process.stop();
        this._selection.alpha = 0;
        this._process.start();
    }
}