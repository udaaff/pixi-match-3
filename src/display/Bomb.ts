import { Container, Sprite } from "pixi.js";
import { int } from "../utils/integer";
import { BoardObject, BoardObjectParams, IBomb, Matchable } from "./BoardObject";
import { ParallelProcess } from "../process/ParallelProcess";
import { getMatchTypeByEntityID } from "../model/matchColor";
import { cfg } from "../game/cfg";
import { Process } from "../process/Process";
import { ImpulsController } from "../process/ImpulsController";
import { TweenProcess } from "../process/TweenProcess";

export abstract class Bomb extends BoardObject implements IBomb, Matchable {
    public isLast = false;
    public isAuto = false;
    public triggerMatchType = -1;
    public bombType = -1;
    public last = false;
    public readonly matchType: int;
    protected readonly _container = new Container();
    protected readonly _image: Sprite;
    protected readonly _imageTN: string;
    private _highlight: Sprite | null = null;
    private readonly _entityIDToTextureName: { [key: number]: string };
    private readonly _impulsContainer = new Container();
    private _auto = false;
    private _blickProcess: ParallelProcess | null = null;
    private readonly _impulsController: ImpulsController;

    constructor(params: BoardObjectParams, idToTextureName: { [key: number]: string }) {
        super(params);
        this._entityIDToTextureName = idToTextureName;

        this.addChild(this._impulsContainer)
        this._impulsContainer.addChild(this._container);
        this._impulsController = new ImpulsController(this._impulsContainer);

        this.matchType = getMatchTypeByEntityID(this.entityID);
        if (!(this.entityID in this._entityIDToTextureName))
            throw new Error("No texture name associated with the entity id");

        this._imageTN = this._entityIDToTextureName[this.entityID];
        this._image = Sprite.from(this._imageTN);
        this._image.anchor.set(0.5);
        this._image.setSize(cfg.boardCellWidth, cfg.boardCellHeight);
        this._container.addChild(this._image);
    }

    public override onGetFromPool(): void {
        this.scale.set(1);
        this.alpha = 1;
        this.rotation = 0;
        this.position.set(1);
        this._isBlocked = false;
        this._numLives = 1;
        this.coordinates = null;
        if (this._highlight)
            this._highlight.alpha = 0;

        this._auto = false;
        this.last = false;
        this.triggerMatchType = -1;
        this._container.scale.set(1);
        this._impulsContainer.y = 0;
        this._impulsController.start();
    }

    public get auto(): boolean {
        return this._auto;
    }

    public set auto(value: boolean) {
        this._auto = value;
        this.startBlinking();
    }

    private get blinkProcess(): Process {
        if (!this._blickProcess) {
            this._blickProcess = new ParallelProcess([
                new TweenProcess(this._container, {
                    duration: cfg.hintDuration,
                    repeat: 0,
                    yoyo: true,
                    pixi: {
                        scale: 1.1,
                    }
                }),
                new TweenProcess(this.highlight, {
                    duration: cfg.hintDuration,
                    alpha: 1,
                    yoyo: true,
                    repeat: 0,
                })
            ])
        }
        return this._blickProcess;
    }

    public startBlinking(): void {
        this.blinkProcess.start();
    }

    public stopBlinking(): void {
        this.blinkProcess?.stop();
    }

    public addImpuls(): void {
        this._impulsController.addImpuls();
    }

    public override get highlightAlpha(): number {
        return this.highlight.alpha;
    }

    public override set highlightAlpha(value: number) {
        this.highlight.alpha = value;
    }

    public override get highlight(): Sprite {
        if (this._highlight) {
            this._highlight = Sprite.from(`${this._imageTN}_screen`);
            this._highlight.alpha = 0;
            this._highlight.anchor.set(0.5);
            this._container.addChildAt(this._highlight, 1);
        }
        return this._highlight!;
    }
}