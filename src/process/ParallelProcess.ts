import { Process } from "./Process";

export class ParallelProcess extends Process {
    private _n: number = 0;
    private readonly _processes: Process[];

    constructor(processes: Process[], delay = 0) {
        super(delay);
        this._processes = processes;
    }

    protected override onStart(): void {
        this._n = this._processes.length;
        if (this._n == 0) {
            this.complete();
            return;
        }

        for (const process of this._processes) {
            process.onComplete.connect(this.onProcessComplete)
            process.start();
        }
    }

    protected override onStop(): void {
        for (const process of this._processes) {
            process.onComplete.disconnect(this.onProcessComplete);
            process.stop();
        }
    }

    private onProcessComplete = (target: Process): void => {
        target.onComplete.disconnect(this.onProcessComplete);
        if (--this._n == 0)
            this.complete();
    }
}

export function parallel(...processes: Process[]): ParallelProcess {
    return new ParallelProcess(processes);
}