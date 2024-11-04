export class SpawnData {
    public readonly type: number;
    public readonly weight: number;
    constructor(data: any) {
        this.type = data.type;
        this.weight = data.weight;
    }
}