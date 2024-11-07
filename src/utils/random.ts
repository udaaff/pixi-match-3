import { uint } from "./integer";

let _seed = new Date().getTime();

export function setSeed(value: number): void {
    _seed = value;
}

/** 0 <= value < 1 */
export function getRandom(): number {
    _seed = (_seed * 9301 + 49297) % 233280;
    return _seed / 233280;
}

/** 0 <= x < value */
export function getRandomUint(value: uint): uint {
    return Math.floor(getRandom() * value);
}