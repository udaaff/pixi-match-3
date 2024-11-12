import { int } from "../utils/integer";
import { IPool } from "./pool";

type Constructor<T> = new (...args: any[]) => T;

export class Creator<T> {
    private cls: Constructor<T>;

    constructor(cls: Constructor<T>) {
        this.cls = cls;
    }

    public createObject(...args: any[]): T {
        return new this.cls(...args);
    }

    public get objectClass(): Constructor<T> {
        return this.cls;
    }
}

export class EntityPool<T> implements IPool<T> {
    private _idToPool = new Map<number | string, T[]>();
    private _idToObjects = new Map<number | string, Map<T, boolean>>();
    private _n: int = 0;
    constructor(private _creator: Creator<T>) { }

    public get creator(): Creator<T> {
        return this._creator;
    }

    public getObject(id: int): T {
        let object: T;
        let pool = this._idToPool.get(id);
        if (!pool) {
            pool = [];
            console.log(`[Pool] ${this._creator.objectClass} URI: ${id} created.`);
            this._idToPool.set(id, pool);
            this._idToObjects.set(id, new Map());
        }

        if (pool.length > 0) {
            object = pool.pop() as T;
            console.log(`[Pool] <<< Get object from pool ${this._creator.objectClass} URI: ${id}. Length ${pool.length}`);
            this._idToObjects.delete(id);
        }
        else {
            object = this._creator.createObject(id);
            console.log(`[Pool] +++ Create object ${this._creator.objectClass} URI: ${id}`);
        }

        this._n++;
        return object;
    }

    public disposeObject(object: T, id: number | string): void {
        const objects = this._idToObjects.get(id);
        if (objects?.get(object))
            return;

        console.log(`[Pool] --- Dispose object ${this._creator.objectClass} URI: ${id}. Length ${this._idToPool.get(id)!.length}`);
        this._n--;

        this._idToPool.get(id)!.push(object);
        objects!.set(object, true);
    }

    public toString(): string {
        let length = 0;
        for (const pool of this._idToPool) {
            length += pool.length;
        }
        return `[Pool] Type ${this._creator.objectClass}. Length ${length}. Out of pool ${this._n}`;
    }
}

