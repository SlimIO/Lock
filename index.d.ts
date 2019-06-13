declare namespace Lock {
    export type LockHandler = () => void;

    interface Options {
        max?: number;
    }
}

declare class Lock {
    constructor(options?: Lock.Options);
    static CHECK_INTERVAL_MS: number;

    lock(): Promise<Lock.LockHandler>;
    static all(promises: Promise[], options?: Lock.Options): Promise<any>;
}

export = Lock;
export as namespace Lock;
