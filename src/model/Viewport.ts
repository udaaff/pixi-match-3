import { int } from "../utils/integer";

export class Viewport {
    private _row: int;
    private _column: int;
    private _bottomRow: int = 0;
    private _rightColumn: int = 0;

    constructor(
        public readonly vLength: int,
        public readonly hLength: int, row: int = 0, column: int = 0) {
        this._row = row;
        this._column = column;
        this.update();
    }

    public get row(): int { return this._row; }
    public set row(value: int) {
        this._row = value;
        this.update();
    }

    public get column(): int { return this._column; }
    public set column(value: int) {
        this._column = value;
        this.update();
    }

    public get bottomRow(): int { return this._bottomRow; }
    public get rightColumn(): int { return this._rightColumn; }

    private update(): void {
        this._bottomRow = this._row + this.vLength - 1;
        this._rightColumn = this._column + this.hLength - 1;
    }

    public contains(row:int, column:int): boolean {
        return row >= this._row
            && row <= this._bottomRow
            && column >= this._column
            && column <= this._rightColumn
    }

    public toString(): string {
        return `[ Viewport ][ row: ${this._row}; column: ${this._column}; vLength: ${this.vLength}"; hLength: ${this.hLength} ]`;
    }
}