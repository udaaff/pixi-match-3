import { int } from "../utils/integer";
import { M3Model } from "./M3Model";

const _MATCH_PATTERNS = [
    [ [  0, -1 ], [  0, -2 ], [ -1, -2 ], [  0, -3 ], [  1, -2 ] ],
    [ [  0,  1 ], [  0,  2 ], [ -1,  2 ], [  0,  3 ], [  1,  2 ] ],
    [ [ -1,  0 ], [ -2,  0 ], [ -2, -1 ], [ -3,  0 ], [ -2,  1 ] ],
    [ [  1,  0 ], [  2,  0 ], [  2, -1 ], [  3,  0 ], [  2,  1 ] ],
    [ [  0,  2 ], [  0,  1 ], [ -1,  1 ], [  1,  1 ] ],
    [ [  2,  0 ], [  1,  0 ], [  1, -1 ], [  1,  1 ] ]
];

export class Matcher {
    constructor(model: M3Model) {

    }

    public hasMatch(): boolean {
        return false;
    }

    public hasMove(): boolean {
        return false;
    }
}