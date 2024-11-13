export class SpawnData {
    public readonly type: number;
    public readonly weight: number;
    constructor(data: any) {
        console.log("spd ", data)
        this.type = data[0];
        this.weight = data[1];
    }
}