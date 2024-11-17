import { BombType } from "../model/BombType";
import { EntityID } from "../model/EntityID";
import { int } from "../utils/integer";
import { Bomb } from "./Bomb";

export class BarrelBomb extends Bomb {
    constructor(entityID: int) {
        super({
            entityID,
            isAffectable: true,
            isSquareBomb5x5: true,
            isGem: true,
            isKey: true,
        }, { [EntityID.GEM_BLUE]: "swirl" });

        this.bombType = BombType.SQUARE_5x5;
    }
}