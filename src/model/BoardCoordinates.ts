import { int } from "../utils/integer";

export class BoardCoordinates {
    constructor(
        public readonly row: int,
        public readonly column: int
    ) {}

    public alignedWith(coordinates: BoardCoordinates): boolean {
        return this.row === coordinates.row || this.column === coordinates.column;
    }

    public equalsTo(coordinates: BoardCoordinates): boolean {
        return this.row === coordinates.row && this.column === coordinates.column;
    }

    public clone(): BoardCoordinates {
        return new BoardCoordinates(this.row, this.column);
    }
}