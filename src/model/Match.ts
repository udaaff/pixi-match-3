import { BoardObject } from "../display/BoardObject";

export class Match {
    public static VERTICAL = 1;
    public static HORIZONTAL = 2;
    public static VERTICAL_HORIZONTAL = 3;

    public static MATCH_3 = "match3";
    public static MATCH_4 = "match4";
    public static MATCH_5 = "match5";
    public static MATCH_CROSS = "matchCross";
    public static MATCH_COLOR = "matchColor";

    constructor(
        public trigger: BoardObject,
        public gems: BoardObject[],
        public type: string,
        public direction = 0
    ) {}

    public getNotBlockedMatchables(): BoardObject[] {
        return this.gems.filter(gem => !gem.isBlocked);
    }
}