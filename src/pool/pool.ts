export interface PoolClient {
    onGetFromPool(): void;
    onDisposeToPool(): void;
}

export interface IPool<T> {
    // get creator(): void;
    getObject(...args: any[]): T;
    disposeObject(object: T, ...args: any[]): void;
    toString(): string;
}

class Pool<T = new () => any> implements IPool<T>{
    private readonly pool: T[] = [];
    private readonly objectsMap: Map<T, boolean> = new Map();
    private outOfPoolCount: number = 0;

    constructor(private readonly type: new () => T) {
        console.log(`[Pool] ${this.type.name} created.`);
    }

    /**
     * Retrieves an object from the pool or creates a new one if the pool is empty.
     * @returns An instance of the specified type.
     */
    public getObject(): T {
        let obj: T;

        if (this.pool.length > 0) {
            obj = this.pool.pop()!;
            console.log(`[Pool] <<< Get object from pool ${this.type.name}. Length ${this.pool.length}`);
            this.objectsMap.delete(obj);
        } else {
            console.log(`[Pool] +++ Create object ${this.type.name}`);
            obj = new this.type();
        }

        this.outOfPoolCount++;
        return obj;
    }

    /**
     * Disposes an object back to the pool, marking it as reusable.
     * @param object The object to dispose.
     */
    public disposeObject(object: T): void {
        if (this.objectsMap.has(object)) return;

        this.pool.push(object);
        this.objectsMap.set(object, true);

        console.log(`[Pool] --- Dispose object ${this.type.name}. Length ${this.pool.length}`);
        this.outOfPoolCount--;
    }

    toString(): string {
        return `[Pool] Type ${this.type.name}. Length ${this.pool.length}. Out of pool ${this.outOfPoolCount}`;
    }
}

const pools: Map<new () => any, IPool<any>> = new Map();

export function registerPool<T>(pool: IPool<T>, type: new (...args: any[]) => any): void {
    pools.set(type, pool);
}
/**
 * Retrieves an object from the pool, creating a new pool if needed.
 * @param type The class type of the object.
 */
export function getObject<T>(type: new () => T, ...args: any[]): T {
    let pool = pools.get(type);
    if (!pool) {
        pool = new Pool(type);
        pools.set(type, pool);
    }

    const obj = pool.getObject(...args) as T;
    if (typeof (obj as PoolClient).onGetFromPool === 'function') {
        (obj as PoolClient).onGetFromPool();
    }
    return obj;
}

/**
 * Disposes an object back to its pool.
 * @param object The object to dispose.
 */
export function disposeObject<T>(object: T, ...args: any[]): void {
    if (object === null || typeof object !== 'object')
        return;

    const type = object.constructor as new () => T;
    const pool = pools.get(type);

    if (!pool)
        throw new Error(`Pool for ${type.name} is not registered`);

    if (typeof (object as unknown as PoolClient).onGetFromPool === 'function')
        (object as unknown as PoolClient).onGetFromPool();

    pool.disposeObject(object, ...args);
}

/**
 * Logs all registered pools and their current states.
 */
export function tracePools(): void {
    pools.forEach((pool) => console.log(pool.toString()));
}
