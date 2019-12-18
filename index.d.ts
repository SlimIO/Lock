declare namespace Lock {
    interface Options {
        maxConcurrent?: number;
    }
}

declare class Lock {
    constructor(options?: Lock.Options);
    public readonly max: number;
    public readonly running: number;

    rejectAll(errorMessage?: string): void;
    reset(): void;
    acquireOne(): Promise<() => void>;
    freeOne(error?: Error | null): void;
}

export = Lock;
export as namespace Lock;
