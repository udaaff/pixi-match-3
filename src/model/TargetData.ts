import { Signal } from "typed-signals";
import { int, SafeInt } from "../utils/integer";

export class TargetData {
    public readonly entityID: int;
    public readonly defaultAmount: int;
    public readonly onAmountChanged = new Signal<() => void>();
    private _amount: SafeInt;

    constructor(data: any) {
        if (!Array.isArray(data))
            throw new Error("Data provided should be an array");

        this.entityID = data[0];
        this.defaultAmount = data[1];
        this._amount = new SafeInt(this.defaultAmount);
    }

    public get amount(): int { return this._amount.value; }
    public set amount(value: int) {
        this._amount.value = value;
        this.onAmountChanged.emit();
    }

    public clone(): TargetData {
        return new TargetData([this.entityID, this.defaultAmount]);
    }
}