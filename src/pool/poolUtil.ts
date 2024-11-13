import { Sprite } from "pixi.js";
import { Sand } from "../display/Sand";
import { Creator, EntityPool, SpriteCreator } from "./EntityPool";
import { getObject, registerPool } from "./pool";
import { Gem } from "../display/Gem";
import { Soil } from "../display/Soil";

export function registerPools() {
    registerPool(new EntityPool(new Creator(Sand)), Sand);
    registerPool(new EntityPool(new Creator(Soil)), Soil);
    registerPool(new EntityPool(new Creator(Gem)), Gem);
    registerPool(new EntityPool(new SpriteCreator(Sprite)), Sprite);
}