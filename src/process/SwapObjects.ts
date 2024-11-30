import { Point } from "pixi.js";
import { getCenterAtCoordinates } from "../display/Board";
import { BoardObject } from "../display/BoardObject";
import { GameplayInternal } from "./GameplayInternal";
import { parallel, ParallelProcess } from "./ParallelProcess";
import { Process } from "./Process";
import { serial, SerialProcess } from "./SerialProcess";
import { tween, TweenProcess } from "./TweenProcess";

const SWAP_TIME = .2;
const SWAP_SCALE_UNDER = .6;
const SWAP_SCALE_OVER = 1.4;

export class SwapObjects extends GameplayInternal {
    private _tweens!: Process;

    constructor(
        private readonly object1: BoardObject,
        private readonly object2: BoardObject,
        private readonly back = true) {
        super();
    }

    protected override onStart(): void {
        if (!this.object1.coordinates || !this.object2.coordinates)
            throw new Error("provided object doesn't have coordinates");

        // глазастики, которых перемещаем, помещаем на верхний слой
        this.ctx.view.gemsContainer.addChild(this.object1);

        const p1= this.back
            ? getCenterAtCoordinates(this.object1.coordinates)
            : getCenterAtCoordinates(this.object2.coordinates);
        const p2 = this.back
            ? getCenterAtCoordinates(this.object2.coordinates)
            : getCenterAtCoordinates(this.object1.coordinates);

        // var eyeActions: Array;
        // var eye: Eye;
        // if (object1.coordinates.row == object2.coordinates.row) {
        //     if (this.object1 is IHasEye)
        //     {
        //         eye = IHasEye(this.object1).getEye();
        //         GameTween.stopTweensOf(eye);
        //         eyeActions = [
        //             new GameTween(eye, .2, { x: this.object1.x > p1.x ? 6 : -6, transition: STransitions.EASE_OUT_SINE }),
        //             new GameTween(eye, .9, { x: 0, transition: Transitions.EASE_OUT_ELASTIC })
        //         ];
        //         Context.actionManager.push(new GameSerialAction(eyeActions), ProcessLane.GAME_ANIMATION, false);
        //     }

        //     if (this.object2 is IHasEye)
        //     {
        //         eye = IHasEye(this.object2).getEye();
        //         GameTween.stopTweensOf(eye);
        //         eyeActions = [
        //             new GameTween(eye, .2, { x: this.object2.x > p2.x ? 6 : -6, transition: STransitions.EASE_OUT_SINE }),
        //             new GameTween(eye, .9, { x: 0, transition: Transitions.EASE_OUT_ELASTIC })
        //         ];
        //         Context.actionManager.push(new GameSerialAction(eyeActions), ProcessLane.GAME_ANIMATION, false);
        //     }
        // }
        // else {
        //     if (this.object1 is IHasEye)
        //     {
        //         eye = IHasEye(this.object1).getEye();
        //         GameTween.stopTweensOf(eye);
        //         eyeActions = [
        //             new GameTween(eye, .2, { y: this.object1.y > p1.y ? 6 : -6, transition: STransitions.EASE_OUT_SINE }),
        //             new GameTween(eye, .9, { y: 0, transition: Transitions.EASE_OUT_ELASTIC })
        //         ];
        //         Context.actionManager.push(new GameSerialAction(eyeActions), ProcessLane.GAME_ANIMATION, false);
        //     }

        //     if (this.object2 is IHasEye)
        //     {
        //         eye = IHasEye(this.object2).getEye();
        //         GameTween.stopTweensOf(eye);
        //         eyeActions = [
        //             new GameTween(eye, .2, { y: this.object2.y > p2.y ? 6 : -6, transition: STransitions.EASE_OUT_SINE }),
        //             new GameTween(eye, .9, { y: 0, transition: Transitions.EASE_OUT_ELASTIC })
        //         ];
        //         Context.actionManager.push(new GameSerialAction(eyeActions), ProcessLane.GAME_ANIMATION, false);
        //     }
        // }

        this._tweens = parallel(
            tween(this.object1, SWAP_TIME, { x: p1.x, y: p1.y }),
            tween(this.object2, SWAP_TIME, { x: p2.x, y: p2.y }),
            serial(
                tween(this.object2, SWAP_TIME / 2, { pixi: { scale: SWAP_SCALE_UNDER }}),
                tween(this.object2, SWAP_TIME / 2, { pixi: { scale: 1 }})
            ),
            serial(
                tween(this.object1, SWAP_TIME / 2, { pixi: { scale: SWAP_SCALE_OVER }}),
                tween(this.object1, SWAP_TIME / 2, { pixi: { scale: 1 }})
            )
        );
        this._tweens.onComplete.connect(_p => this.complete());
        this._tweens.start();
    }

    protected override onStop(): void {
        this._tweens.stop();
    }
}