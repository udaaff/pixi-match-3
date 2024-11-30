import { cfg } from "../game/cfg";
import { BombType } from "../model/BombType";
import { EntityID } from "../model/EntityID";
import { TweenProcess } from "../process/TweenProcess";
import { int } from "../utils/integer";
import { Matchable, Moveable } from "./BoardObject";
import { Bomb } from "./Bomb";


const _GRAPHICS: { [key: number]: string } = {
    [EntityID.BOMB_3x3_BLUE]: "board/gems/b21",
    [EntityID.BOMB_3x3_GREEN]: "board/gems/b22",
    [EntityID.BOMB_3x3_ORANGE]: "board/gems/b23",
    [EntityID.BOMB_3x3_PURPLE]: "board/gems/b24",
    [EntityID.BOMB_3x3_RED]: "board/gems/b25",
    [EntityID.BOMB_3x3_YELLOW]: "board/gems/b26",
};

export class SquareBomb extends Bomb implements Moveable, Matchable {
    // private _bgAction:PSBackgroundController;
    // private _bgSystem:PDParticleSystem2;
    private _scaleAction: TweenProcess;

    constructor(entityID: int) {
        super({
            entityID,
            isMoveable: true,
            isMatchable: true,
            isSquareBomb3x3: true,
            isGem: true,
            isSleepable: true,
        }, _GRAPHICS);

        this._image.alpha = .9;

        this._scaleAction = new TweenProcess(this._container, {
            duration: cfg.bombFloatingPeriod,
            pixi: { scale: 1.05 },
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });

        // this._bgAction = new Bomb3x3BGController();

        // var color:uint = Color.getColorByMatchType(super.matchType);
        // this._bgAction.startColor = color;
        // this._bgAction.start();
        // this._bgSystem = this._bgAction.system;
    }

    public override set x(value: number) {
        super.x = value;

        // if (this._bgSystem)
        //     this._bgSystem.emitterX = value + this._container.x;
    }

    public override set y(value: number) {
        super.y = value;

        // if (this._bgSystem)
        //     this._bgSystem.emitterY = value + this._container.y;
    }

    public override onDisposeToPool(): void {
        // this._bgAction.stop();
        // this._bgSystem = null;

        this._scaleAction.stop();
        super.onDisposeToPool();
    }

    public override onGetFromPool(): void {
        super.onGetFromPool();
        this._scaleAction.start();
        this.bombType = BombType.SQUARE_3x3;

        // this._bgAction.start();
        // this._bgSystem = this._bgAction.system;
    }

    public sleep(): void {
        // this._bgAction.sleep();
    }

    public wakeUp(): void {
        // this._bgAction.wakeUp();
    }
}