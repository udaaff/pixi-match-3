import { BoardObject } from "../display/BoardObject";
import { GameplayInternal } from "./GameplayInternal";

export class Idle2Animation extends GameplayInternal {
    constructor(private readonly gem: BoardObject) {
        super();
    }
    protected override onStart(): void {
        this.complete();
    }
}