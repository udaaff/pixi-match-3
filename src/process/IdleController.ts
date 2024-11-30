import { Swap } from "../model/Swap";
import { getRandomElement } from "../utils/arrayUtils";
import { GameplayInternal } from "./GameplayInternal";
import { Hint } from "./Hint";
import { Idle1Animation } from "./Idle1Animation";
import { Idle2Animation } from "./Idle2Animation";
import { Process } from "./Process";
import { RepeatCall } from "./RepeatCall";

const animations = [
    Idle1Animation,
    Idle2Animation,
    Idle2Animation,
    Idle2Animation,
];

export class IdleController extends GameplayInternal {
    private _currentAction: Process | null = null;
    private _hintController!: Hint;
    private _repeatCall!: RepeatCall;

    constructor(private readonly _possibleSwap: Swap) {
        super();
    }

    protected override onStart(): void {
        this._repeatCall = new RepeatCall(() => this.onInterval(), 4000);
        // this._repeatCall.start();

        this._hintController = new Hint(this._possibleSwap).start();
    }

    protected override onStop(): void {
        if (this._currentAction)
            this._currentAction.stop();

        this._hintController.stop();
        this._repeatCall.stop();
    }

    private onInterval(): void {
        if (this._currentAction && this._currentAction.isRunning)
            this._currentAction.stop();

        const gem = this.ctx.model.getRandomGemWithEye(this._possibleSwap.object1, this._possibleSwap.object2);
        if (!gem)
            return;

        const C = getRandomElement(animations)!;
        this._currentAction = new C(gem).start();
    }
}