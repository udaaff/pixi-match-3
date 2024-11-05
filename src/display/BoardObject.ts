import { Container } from "pixi.js"
import { BoardCoordinates } from "../model/BoardCoordinates";

export abstract class BoardObject extends Container {
    public isBlocked: boolean = false;
    public coordinates: BoardCoordinates | null = null;
}