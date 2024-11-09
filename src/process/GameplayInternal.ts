import { Context } from "./Context";
import { GameplayProcess } from "./GameplayProcess";
import { Process } from "./Process";

export class GameplayInternal extends Process {
    protected get ctx(): Context { return GameplayProcess.ctx }
}

