import { GameplayInternal } from "./GameplayInternal";

export class UnblockInteraction extends GameplayInternal {
    protected override onStart(): void {
        this.ctx.model.interactionEnabled = true;
        this.complete();
    }
}