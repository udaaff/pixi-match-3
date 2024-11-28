import { Container } from "pixi.js";
import { BombType } from "../model/BombType";
import { EntityID } from "../model/EntityID";
import { int } from "../utils/integer";
import { Bomb } from "./Bomb";
import { TweenProcess } from "../process/TweenProcess";
import { HasEye, Moveable, Sleepable } from "./BoardObject";
import { Eye } from "./Eye";

const _GRAPHICS: { [key: number]: string } = {
    [EntityID.BOMB_COLOR]: "board/gems/star",
}

export class ColorBomb extends Bomb implements Sleepable, HasEye, Moveable {
    // private _bgAction: PSBackgroundController;
    // private _bgSystem: PDParticleSystem2;
    // private _chargeAction: PSBackgroundController;
    // private _chargeSystem: PDParticleSystem2;
    // private _eye: Eye;
    private _eyeContainer = new Container();
    private _scaleAction: TweenProcess;

    constructor(entityID: int) {
        super({
            entityID,
            isMoveable: true,
            isColorBomb: true,
            isGem: true,
            hasEye: true,
            isSleepable: true,
        }, _GRAPHICS);

        this.bombType = BombType.COLOR;
        // this._bgAction = new ColorBombBGController();
        // this._chargeAction = new Charge2Fx();
        this._image.alpha = .85;

        this._scaleAction = new TweenProcess(this._container, {
            duration: 2,
            ease: "bounce.in",
            repeat: -1,
            yoyo: true,
            pixi: {
                scale: 1.08
            }
        });

        // this._eye = new Eye(matchType);
        // this._eyeContainer.x = Eye.EYE_POSITION[matchType][0];
        // this._eyeContainer.y = Eye.EYE_POSITION[matchType][1];

        this._container.addChild(this._eyeContainer);
        // this._eyeContainer.addChild(this._eye);
    }

    public override set x(value: number) {
        super.x = value;

        // if (this._bgSystem)
        //     this._bgSystem.emitterX = value + this._container.x;

        // if (this._chargeSystem)
        //     this._chargeSystem.emitterX = value;
    }

    public override set y(value: number) {
        super.y = value;

        // if (this._bgSystem)
        //     this._bgSystem.emitterY = value + this._container.y;

        // if (this._chargeSystem)
        //     this._chargeSystem.emitterY = value;
    }

    public override onDisposeToPool(): void {
        // if (this._bgAction.running) {
        //     this._bgAction.stop();
        //     this._bgSystem = null;
        // }

        // if (this._chargeAction.running) {
        //     this._chargeAction.stop();
        //     this._chargeSystem = null;
        // }

        this._scaleAction.stop();
        super.onDisposeToPool();

        // this._eye.toPoolHandler();
    }

    public override onGetFromPool(): void {
        super.onGetFromPool();
        this.bombType = BombType.COLOR;

        this._scaleAction.start();
        // this._bgAction.start();
        // this._bgSystem = this._bgAction.system;

        // this._chargeAction.start();
        // this._chargeSystem = this._chargeAction.system;

        // this._eye.fromPoolHandler();
    }

    public getEye(): Eye {
        // return this._eye;
        throw new Error("uncomment and implement");
    }

    public sleep(): void {
        // this._bgAction.sleep();
    }

    public wakeUp(): void {
        // this._bgAction.wakeUp();
    }
}