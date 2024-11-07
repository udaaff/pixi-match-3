import { BoardObject } from "../display/BoardObject"
import { Bomb } from "../display/Bomb"
import { ColorBomb } from "../display/ColorBomb"
import { HBomb } from "../display/HBomb"
import { SquareBomb } from "../display/SquareBomb"
import { VBomb } from "../display/VBomb"

export enum SwapType {
    SIMPLE = "simple",
    COLOR = "color",
    COLOR_SQUARE = "colorSquare",
    COLOR_CROSS = "colorCross", // XXX unused
    COLOR_H_V = "colorHV",
    H_V = "hV",
    CROSS_SQUARE = "crossSquare",
    DOUBLE_SQUARE = "doubleSquare",
    DOUBLE_CROSS = "doubleCross",
    DOUBLE_COLOR = "doubleColor",
}

export class Swap {
    constructor(
        public readonly object1: BoardObject,
        public readonly object2: BoardObject
    ) {}

    public getSwapType(): SwapType {
        if (this.object1 instanceof Bomb && this.object2 instanceof Bomb) {
            if (this.object1 instanceof SquareBomb && this.object2 instanceof SquareBomb)
                return SwapType.DOUBLE_SQUARE;

            if (this.object1 instanceof ColorBomb && this.object2 instanceof ColorBomb)
                return SwapType.DOUBLE_COLOR;

            if ((this.object1 instanceof HBomb || this.object1 instanceof VBomb)
                    && (this.object2 instanceof HBomb || this.object2 instanceof VBomb))
                return SwapType.H_V;

            // no similar bombs anymore
            if (this.object1 instanceof ColorBomb)
                if (this.object2 instanceof HBomb || this.object2 instanceof VBomb)
                    return SwapType.COLOR_H_V;
                else
                    return this.object2 instanceof SquareBomb
                        ? SwapType.COLOR_SQUARE : SwapType.COLOR_CROSS;

            if (this.object2 instanceof ColorBomb)
                if (this.object1 instanceof HBomb || this.object1 instanceof VBomb)
                    return SwapType.COLOR_H_V;
                else
                    return this.object1 instanceof SquareBomb
                        ? SwapType.COLOR_SQUARE : SwapType.COLOR_CROSS;

            return SwapType.CROSS_SQUARE;
        }

        if (this.object1 instanceof ColorBomb || this.object2 instanceof ColorBomb)
            return SwapType.COLOR;

        return SwapType.SIMPLE;
    }
}