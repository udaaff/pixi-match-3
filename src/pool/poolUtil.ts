import { Sand } from "../display/Sand";
import { Creator, EntityPool } from "./EntityPool";
import { registerPool } from "./pool";

export function registerPools() {
    registerPool(new EntityPool(new Creator(Sand)), Sand);
}