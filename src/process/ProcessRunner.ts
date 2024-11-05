import { removeElementAt } from "../utils/arrayUtils";
import { Process } from "./Process";

type LaneID = "game";

class Lane {
    public blockingProcesses: Process[] = [];
    public nonblockingProcesses: Map<Process, Process[]> = new Map();
    public currentBlockingProcess: Process | null = null;
    public currentNonblockingProcess: Process[] = [];

    public interrupt(): void {
        if (this.currentBlockingProcess) {
            this.currentBlockingProcess.stop();
            this.currentBlockingProcess = null;
            this.blockingProcesses = [];
            this.nonblockingProcesses = new Map();
        }

        if (this.currentNonblockingProcess.length > 0) {
            for (const process of this.currentNonblockingProcess) {
                process.stop();
            }
            this.currentNonblockingProcess = [];
        }
    }
}

const laneIdToLane: Map<string, Lane> = new Map();
const processToLane: Map<Process, Lane> = new Map();

export function addProcess(process: Process, laneID: LaneID, isBlocking = true): void {
    if (processToLane.has(process))
        return;

    let lane = laneIdToLane.get(laneID);
    if (!lane) {
        lane = new Lane();
        laneIdToLane.set(laneID, lane);
    }
    processToLane.set(process, lane);

    if (isBlocking) {
        lane.blockingProcesses.push(process);
        if (lane.blockingProcesses.length == 1) {
            lane.currentBlockingProcess = process;
            process.onComplete.connect(onBlockingProcessComplete);
            process.start();
        }
        return;
    }

    if (lane.blockingProcesses.length > 0) {
        const lastBlockingProcess = lane.blockingProcesses[lane.blockingProcesses.length - 1];
        let nonblockingProcesses = lane.nonblockingProcesses.get(lastBlockingProcess);
        if (!nonblockingProcesses) {
            nonblockingProcesses = [];
            lane.nonblockingProcesses.set(lastBlockingProcess, nonblockingProcesses);
        }
        nonblockingProcesses.push(process);
        return;
    }

    lane.currentNonblockingProcess.push(process);
    process.onComplete.connect(onNonblockingProcessComplete);
    process.start();
}

export function interrupt(laneId: LaneID): void {
    const lane = laneIdToLane.get(laneId);
    if (!lane)
        return;

    lane.interrupt();
}

function onBlockingProcessComplete(process: Process): void {
    const lane = processToLane.get(process);
    if (!lane)
        return;

    lane.blockingProcesses.shift();
    processToLane.delete(process);

    const nonblockingActions = lane.nonblockingProcesses.get(process);
    if (nonblockingActions && nonblockingActions.length > 0) {
        for (const nonblockingAction of nonblockingActions) {
            lane.currentNonblockingProcess.push(nonblockingAction);
            nonblockingAction.onComplete.connect(onNonblockingProcessComplete);
            nonblockingAction.start();
        }
        lane.nonblockingProcesses.delete(process);
    }

    if (lane.blockingProcesses.length == 0)
        return;

    const nextProcess = lane.blockingProcesses[0];
    lane.currentBlockingProcess = nextProcess;
    nextProcess.onComplete.connect(onBlockingProcessComplete);
    nextProcess.start();
}

function onNonblockingProcessComplete(process: Process): void {
    const lane = processToLane.get(process);
    if (!lane)
        return;

    removeElementAt(lane.currentNonblockingProcess, process);
    processToLane.delete(process);
}