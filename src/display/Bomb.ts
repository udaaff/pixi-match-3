import { BoardObject } from "./BoardObject";

export class Bomb extends BoardObject {
    public isLast = false;
    public isAuto = false;
    public triggerMatchType = -1;
    public bombType = -1;
}