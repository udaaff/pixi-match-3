import { Process } from "./Process";

export class Invoke extends Process {
    constructor(
        private readonly func: Function,
        private readonly thisArg?: any ,
        private readonly args?: any[]) {
        super();
    }

    protected override onStart(): void {
        this.func.apply(this.thisArg, this.args);
        this.complete();
    }
}