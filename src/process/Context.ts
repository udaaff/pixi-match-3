import { Board } from "../display/Board";
import { M3Model } from "../model/M3Model";

export class Context {
    constructor(
        public readonly model: M3Model,
        public readonly view: Board
    ) {}
}