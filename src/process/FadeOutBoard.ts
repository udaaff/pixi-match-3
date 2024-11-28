import { GameplayInternal } from "./GameplayInternal";
import { TweenProcess } from "./TweenProcess";

export class FadeOutBoard extends GameplayInternal {
    private _tween: TweenProcess | null = null;

    protected override onStart(): void {
        this.ctx.view.movingContainer.alpha = 0;
        this._tween = new TweenProcess(this.ctx.view.movingContainer, {
            duration: 0.5,
            alpha: 1,
        });
        this._tween.onComplete.connect(_ => this.complete());
        this._tween.start();
    }

    protected override onStop(): void {
        this._tween?.stop();
        this.ctx.view.movingContainer.alpha = 1;
    }
}