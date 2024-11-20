import { Process } from "./Process";
import { TweenProcess } from "./TweenProcess";

export class ImpulsController extends Process {
    private _tween: TweenProcess;

    constructor(target: any) {
        super();
        this._tween = new TweenProcess(target, {
            duration: 0.4,
            y: -25,
            ease: "sine.inOut",
            repeat: 2,
            yoyo: true,
        });
    }

    protected override onStop(): void {
        this._tween.stop();
    }

    public addImpuls(): void {
        this._tween.start();
    }
}