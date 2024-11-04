import { int } from "../utils/integer";

export class TargetData {
    public readonly entityID: int;
    public readonly defaultAmount: int;

    constructor(data: any) {
        if (!Array.isArray(data))
            throw new Error("Data provided should be an array");

        this.entityID = data[0];
        this.defaultAmount = data[1];
    }
}