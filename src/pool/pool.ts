class Pool<T = new () => any> {
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

const pools: Map<new () => any, Pool<any>> = new Map();

/**
 * Retrieves an object from the pool, creating a new pool if needed.
 * @param type The class type of the object.
 */
export function getObject<T>(type: new () => T): T {
    let pool = pools.get(type);
    if (!pool) {
        pool = new Pool(type);
        pools.set(type, pool);
    }

    return pool.getObject();
}

/**
 * Disposes an object back to its pool.
 * @param object The object to dispose.
 */
export function disposeObject<T>(object: T): void {
    if (object === null || typeof object !== 'object')
        return;

    const type = object.constructor as new () => T;
    const pool = pools.get(type);

    if (!pool) throw new Error(`Pool for ${type.name} is not registered`);
    pool.disposeObject(object);
}

/**
 * Logs all registered pools and their current states.
 */
export function tracePools(): void {
    pools.forEach((pool) => console.log(pool.toString()));
}
