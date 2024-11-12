import { Sprite } from "pixi.js";
import { Sand } from "../display/Sand";
import { Creator, EntityPool, SpriteCreator } from "./EntityPool";
import { getObject, registerPool } from "./pool";

export function registerPools() {
    registerPool(new EntityPool(new Creator(Sand)), Sand);
    registerPool(new EntityPool(new SpriteCreator(Sprite)), Sprite);
}