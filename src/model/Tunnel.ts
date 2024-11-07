import { BoardCoordinates } from "./BoardCoordinates";

export class Tunnel {
    constructor(
        public readonly entrance: BoardCoordinates,
        public readonly exit: BoardCoordinates
    ) {}
}