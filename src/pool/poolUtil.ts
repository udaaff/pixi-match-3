import { Sprite } from "pixi.js";
import { Sand } from "../display/Sand";
import { Creator, EntityPool, SpriteCreator } from "./EntityPool";
import { getObject, registerPool } from "./pool";
import { Gem } from "../display/Gem";
import { Soil } from "../display/Soil";
import { BarrelBomb } from "../display/BarrelBomb";
import { Lock } from "../display/Lock";
import { Stone } from "../display/Stone";

export function registerPools() {
    registerPool(new EntityPool(new Creator(Stone)), Stone);
    registerPool(new EntityPool(new Creator(Sand)), Sand);
    registerPool(new EntityPool(new Creator(Soil)), Soil);
    registerPool(new EntityPool(new Creator(Lock)), Lock);
    registerPool(new EntityPool(new Creator(BarrelBomb)), BarrelBomb);
    registerPool(new EntityPool(new Creator(Gem)), Gem);
    registerPool(new EntityPool(new SpriteCreator(Sprite)), Sprite);
}