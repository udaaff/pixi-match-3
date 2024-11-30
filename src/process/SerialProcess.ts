import { Process } from "./Process";

export class SerialProcess extends Process {
    private _currentProcess!: Process;
    private _n: number = 0;
    private readonly _processes: Process[];

    constructor(processes: Process[], delay = 0) {
        super(delay);
        this._processes = processes;
    }

    protected override onStart(): void {
        this.process();
    }

    protected override onStop(): void {
        this._currentProcess.stop();
    }

    private process(): void {
        if (this._n in this._processes) {
            this._currentProcess = this._processes[this._n++];
            this._currentProcess.onComplete.connect(this.onProcessComplete);
            this._currentProcess.start();
            return;
        }

        this.complete();
    }

    private onProcessComplete = (target: Process) => {
        target.onComplete.disconnect(this.onProcessComplete);
        this.process();
    }
}

export function serial(...processes: Process[]): SerialProcess {
    return new SerialProcess(processes);
}