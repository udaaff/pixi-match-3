import gsap from "gsap";
import { removeElementAt } from "../utils/arrayUtils";
import { Process } from "./Process";

// target -> [ tween, tween, ... , tween ]
const targetToActiveTweenMap = new Map<any, TweenProcess[]>();
window.test2 = targetToActiveTweenMap;

export function stopTweensOf(target: any): void {
    const tweens = targetToActiveTweenMap.get(target);
    if (!tweens || tweens.length == 0)
        return;

    for (let i = tweens.length - 1; i > -1; i--) {
        const tween = tweens[i];
        tween.stop(true);
    }
}

export class TweenProcess extends Process {
    private _onCompleteCallback!: gsap.Callback | undefined | ((...args: any[]) => void);
    private _tween: gsap.core.Tween | null = null;

    constructor(
        private _target: any,
        public props: gsap.TweenVars, delay = 0
    ) {
        super(delay);
        this._onCompleteCallback = this.props["onComplete"];
    }

    /**
     * What happens here:
     * 1. We retrieve an array (of tweens) or create a new one for the given target.
     * 2. If the array contains a tween, we check if there might be a conflict with the current one.
     *    If there is a conflict, we stop the found tween and remove it from the array.
     *    (the mechanism for stopping a specific property is not implemented, as it would either require
     *    patching the Starling tween or tweening each property of the object separately, which is costly)
     * 3. We push the current tween into the array.
     */
    protected override onStart(): void {
        let tweens = targetToActiveTweenMap.get(this._target);
        if (!tweens) {
            tweens = [];
            targetToActiveTweenMap.set(this._target, tweens);
        }

        outerLoop:
        for (const tween of tweens) {
            for (let propName in this.props) {
                if (tween.props.hasOwnProperty(propName)) {
                    if (propName === "pixi") {
                        for (let pixiPropName in this.props.pixi) {
                            if ((tween.props.pixi as Object).hasOwnProperty(pixiPropName)) {
                                tween.stop(true);
                                continue outerLoop;
                            }
                        }
                    }
                    tween.stop(true);
                    continue outerLoop;
                }
            }
        }

        tweens.push(this);

        this.props["onComplete"] = (...args: any[]) => this.tweenCallback(...args);
        this._tween = gsap.to(this._target, this.props);
    }

    protected override onStop(): void {
        this._tween?.kill()
        this._tween = null;

        const tweens = targetToActiveTweenMap.get(this._target);
        if (!tweens)
            throw new Error("No tweens were specified");

        const index = tweens.indexOf(this);
        removeElementAt(tweens, index);

    }

    private tweenCallback(...args: unknown[]): void {
        if (this._onCompleteCallback)
            this._onCompleteCallback.apply(null, args);

        const tweens = targetToActiveTweenMap.get(this._target);
        if (!tweens)
            throw new Error("Twween is alive, but no tweens were registered");

        const index = tweens.indexOf(this) ?? -1;
        if (index == -1)
            throw new Error("Tween is alive, but not registered");

        removeElementAt(tweens, index);
        this.complete();
    }
}

export function tween(target: any, duration: number, props: gsap.TweenVars): TweenProcess {
    props.duration = duration;
    return new TweenProcess(target, props);
}