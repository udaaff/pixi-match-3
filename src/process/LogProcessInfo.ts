import { logProcessInfo, Process } from "./Process";

export class LogProcessInfo extends Process {
    protected override onStart(): void {
        logProcessInfo();
        this.complete();
    }
}