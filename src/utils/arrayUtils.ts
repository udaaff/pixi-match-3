import { int, uint } from "./integer";
import { getRandom } from "./random";

export function removeElementAt<T>(array: T[], index: uint): T {
    return array.splice(index, 1)[0]
}

export function removeElementOnce<T>(array: T[], element: T): T | null {
    const idx = array.indexOf(element);
    if (idx === -1)
        return null;

    return removeElementAt(array, idx);
}

export function indexInRange<T>(arr: T[], index: int):  boolean {
    return index > -1 && index < arr.length;
}


export function getRandomElement<T>(arr: T[]): T | null {
    if (arr.length == 0)
        return null;

    return arr[Math.floor(getRandom() * arr.length)];
}


export function removeRandomElement<T>(arr: T[]): T {
    return removeElementAt(arr, Math.floor(getRandom() * arr.length));
}

export function shuffle<T>(arr: T[]): T[] {
    var t: T;
    var i: int;
    var l: int = arr.length;
    while (l) {
        i = Math.floor(getRandom() * l--);
        t = arr[l];
        arr[l] = arr[i];
        arr[i] = t;
    }
    return arr;
}

export function swapElementsAt(arr: unknown[], index1: int, index2: int): void {
    var t = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = t;
}
