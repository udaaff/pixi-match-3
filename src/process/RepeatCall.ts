import { Ticker } from "pixi.js";
import { Process } from "./Process";
import { gameTicker } from "../main";

export class RepeatCall extends Process {
    private _elapsedTime = 0; // Tracks the elapsed time between executions
    private _curCount = 0;    // Tracks the number of executions

    constructor(
        private readonly func: Function,  // The function to execute
        private readonly interval: number, // The interval in milliseconds
        private repeatCount = Infinity    // Number of repetitions; defaults to infinite
    ) {
        super();
    }

    protected override onStart(): void {
        gameTicker.add(this.onInterval, this);
    }

    private onInterval(ticker: Ticker): void {
        // Add the time since the last tick to elapsed time
        this._elapsedTime += ticker.deltaMS;

        // Handle case when interval is <= 0
        if (this.interval <= 0) {
            // Execute the function as often as possible, but limit by repeat count
            while (this._curCount < this.repeatCount) {
                this.func();
                this._curCount++;
                if (this._curCount >= this.repeatCount) {
                    this.complete(); // Complete the process when done
                    return;
                }
            }
        } else {
            // Handle regular intervals
            while (this._elapsedTime >= this.interval && this._curCount < this.repeatCount) {
                this.func(); // Call the function
                this._elapsedTime -= this.interval; // Reduce elapsed time
                this._curCount++; // Increment count
            }

            // Complete the process if we've reached the repeat count
            if (this._curCount >= this.repeatCount) {
                this.complete();
            }
        }
    }

    protected override onStop(): void {
        gameTicker.remove(this.onInterval, this); // Clean up when stopping
    }
}
