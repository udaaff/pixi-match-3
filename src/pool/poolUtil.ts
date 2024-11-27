import { Sprite } from "pixi.js";
import { Sand } from "../display/Sand";
import { Creator, EntityPool, SpriteCreator } from "./EntityPool";
import { getObject, registerPool } from "./pool";
import { Gem } from "../display/Gem";
import { Soil } from "../display/Soil";
import { BarrelBomb } from "../display/BarrelBomb";
import { Lock } from "../display/Lock";
import { Stone } from "../display/Stone";
import { Freeze } from "../display/Freeze";
import { ColorBomb } from "../display/ColorBomb";
import { VBomb } from "../display/VBomb";
import { HBomb } from "../display/HBomb";
import { SquareBomb } from "../display/SquareBomb";

export function registerPools() {
    registerPool(new EntityPool(new Creator(Stone)), Stone);
    registerPool(new EntityPool(new Creator(Freeze)), Freeze);
    registerPool(new EntityPool(new Creator(Sand)), Sand);
    registerPool(new EntityPool(new Creator(Soil)), Soil);
    registerPool(new EntityPool(new Creator(Lock)), Lock);
    registerPool(new EntityPool(new Creator(BarrelBomb)), BarrelBomb);
    registerPool(new EntityPool(new Creator(Gem)), Gem);
    registerPool(new EntityPool(new Creator(ColorBomb)), ColorBomb);
    registerPool(new EntityPool(new Creator(VBomb)), VBomb);
    registerPool(new EntityPool(new Creator(HBomb)), HBomb);
    registerPool(new EntityPool(new Creator(SquareBomb)), SquareBomb);
    registerPool(new EntityPool(new SpriteCreator(Sprite)), Sprite);
}