import { cfg } from "../game/cfg";
import { BombType } from "../model/BombType";
import { EntityID } from "../model/EntityID";
import { SerialProcess } from "../process/SerialProcess";
import { TweenProcess } from "../process/TweenProcess";
import { int } from "../utils/integer";
import { HasEye, Matchable, Sleepable } from "./BoardObject";
import { Bomb } from "./Bomb";
import { Eye } from "./Eye";

const _GRAPHICS: { [key: number]: string } = {
    [EntityID.BOMB_H_LINE_BLUE]: "board/gems/s21",
    [EntityID.BOMB_H_LINE_GREEN]: "board/gems/s22",
    [EntityID.BOMB_H_LINE_ORANGE]: "board/gems/s23",
    [EntityID.BOMB_H_LINE_PURPLE]: "board/gems/s24",
    [EntityID.BOMB_H_LINE_RED]: "board/gems/s25",
    [EntityID.BOMB_H_LINE_YELLOW]: "board/gems/s26",
};

export class HBomb extends Bomb implements Matchable, Sleepable, HasEye {
    private _motionAction: SerialProcess;
    // private _eye:Eye;
    // private _eyeContainer:Sprite = new Sprite();

    constructor(entityID: int) {
        super({
            entityID,
            isMoveable: true,
            isMatchable: true,
            isVBomb: true,
            isGem: true,
            hasEye: true,
            isSleepable: true,
        }, _GRAPHICS);

        this._motionAction = new SerialProcess([
            new TweenProcess(this._container, {
                duration: cfg.bombFloatingPeriod,
                x: this._container.x - cfg.bombFloatingAmplitude,
                ease: "sine.inOut"
            }),
            new TweenProcess(this._container, {
                duration: cfg.bombFloatingPeriod,
                x: this._container.x + cfg.bombFloatingAmplitude,
                ease: "sine.inOut",
                repeat: 0,
                yoyo: true,
            })
        ]);

        // entity graphic
        // this._eye = new Eye(matchType);
        // this._eyeContainer.x = Eye.EYE_POSITION[matchType][0];
        // this._eyeContainer.y = Eye.EYE_POSITION[matchType][1];

        // this._container.addChild(this._eyeContainer);
        // this._eyeContainer.addChild(this._eye);
    }

    public override onDisposeToPool(): void {
        this._motionAction.stop();
        super.onDisposeToPool();
        // this._eye.toPoolHandler();
    }

    public override onGetFromPool(): void {
        super.onGetFromPool();
        this._motionAction.start();
        this.bombType = BombType.HORIZONTAL;
        // this._eye.fromPoolHandler();
    }

    public getEye(): Eye {
        // return this._eye;
        throw new Error();
    }

    public sleep(): void {
        this._motionAction.stop();
        if (this.auto)
            this.stopBlinking();
    }

    public wakeUp(): void {
        this._motionAction.start();
    }
}