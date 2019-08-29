declare namespace Lock {
    interface Options {
        maxConcurrent?: number;
    }
}

declare class Lock {
    constructor(options?: Lock.Options);
    public readonly max: number;
    public readonly running: number;
    static CHECK_INTERVAL_MS: number;

    acquireOne(): Promise<() => void>;
    freeOne(): void;
}

export = Lock;
export as namespace Lock;
