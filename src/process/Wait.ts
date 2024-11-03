import { Process } from "./Process";

export class Wait extends Process {
    constructor(delay: number) {
        super(delay);
    }

    protected override onStart(): void {
        this.complete();
    }
}