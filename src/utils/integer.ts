export type int = number;
export type uint = number;

export class SafeInt {
    private _value: int;
    private readonly _key: int = Math.round(1e8 * Math.random());

    constructor(value: int = 0) {
        this._value = value;
    }

    public get value(): int {
        return this._value ^ this._key;
    }

    public set value(value: int) {
        this._value = value ^ this._key;
    }
}