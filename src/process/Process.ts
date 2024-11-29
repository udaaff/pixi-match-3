import { Ticker } from "pixi.js";
import { Signal } from "typed-signals";

import { gameTicker } from "../main";

const debug = true;
const _d: {[key: string]: number} = {};

export function logProcessInfo() {
    console.log(" ### Trace of all started Processes ###");
    for (const key in _d) {
        console.log(key, _d[key]);
    }
    console.log(" ### End ###");
}

window.test = logProcessInfo;

export abstract class Process {
    private readonly _delay: number;
    private _elapsed = 0;
    private _isRunning = false;
    private readonly _onComplete: Signal<(target: Process) => void>;

    private _timestamp = 0;
    private _name = "";

    constructor(delay: number = 0) {
        this._delay = delay;
        this._onComplete = new Signal();

        if (debug)
            this._name = Object(this).constructor.name;
    }

    public get onComplete(): Signal<(target: Process) => void> {
        return this._onComplete;
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }

    public start(): void {
        if (this._isRunning)
            return;

        this._isRunning = true;

        if (debug) {
            let count = _d[this._name] ?? 0;
            ++count;
            _d[this._name] = count;
        }

        if (this._delay > 0) {
            gameTicker.add(this.onTick, this);
        } else {
            if (debug) {
                this._timestamp = Date.now();
                console.log(`[Process] ${this._name} started.`)
            }
            this.onStart();
        }
    }

    protected onStart(): void {

    }

    public stop(emitComplete: boolean = false): void {
        if (!this._isRunning)
            return;

        this._isRunning = false;

        if (this._delay > this._elapsed) {
            gameTicker.remove(this.onTick, this);
        } else {
            this.onStop();
        }

        if (debug) {
            console.log(`[Process] ${this._name} terminated.`)
            --_d[this._name];
        }

        if (emitComplete)
            this._onComplete.emit(this);
    }

    protected onStop(): void {

    }

    public reset(): void {
        this.stop();
        this._elapsed = 0;
        this.onReset();
    }

    protected onReset(): void {

    }

    protected complete(): void {
        if (!this._isRunning)
            return;

        if (debug) {
            console.log(`[Process] ${this._name} completed. Time: ${Date.now() - this._timestamp}`)
            --_d[this._name];
        }
        this._isRunning = false;
        this._onComplete.emit(this);
    }

    private onTick(ticker: Ticker) {
        this._elapsed += ticker.deltaMS;
        if (this._elapsed >= this._delay) {
            gameTicker.remove(this.onTick, this);

            if (debug) {
                this._timestamp = Date.now();
                console.log(`[Process] ${this._name} started.`)
            }

            this.onStart();
        }
    }
}