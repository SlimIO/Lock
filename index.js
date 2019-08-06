"use strict";

// Require Third-party Dependencies
const is = require("@slimio/is");

// SYMBOLS
const SymMax = Symbol("SymMax");
const SymCurr = Symbol("SymCurr");

/**
 * @callback LockHandler
 * @returns {void}
 */

class Lock {
    /**
     * @class Lock
     * @memberof Lock#
     * @param {object} options options
     * @param {number} [options.maxConcurrent=5] maximum concurrent lock
     *
     * @throws {TypeError}
     */
    constructor(options = Object.create(null)) {
        if (!is.plainObject(options)) {
            throw new TypeError("options must be a plainObject");
        }
        const { maxConcurrent = 5 } = options;

        if (typeof maxConcurrent !== "number") {
            throw new TypeError("maxConcurrent must be number");
        }

        Object.defineProperty(this, SymMax, { value: maxConcurrent });
        Object.defineProperty(this, SymCurr, { value: 0, writable: true });
    }

    /**
     * @member {number} max
     * @memberof Lock#
     * @returns {number}
     */
    get max() {
        return this[SymMax];
    }

    /**
     * @async
     * @function acquireOne
     * @description Acquire one spot on the locks pool.
     * @memberof Lock#
     * @returns {Promise<LockHandler>}
     */
    async acquireOne() {
        if (this[SymCurr] >= this.max) {
            await new Promise((resolve) => {
                const timer = setInterval(() => {
                    if (this[SymCurr] < this.max) {
                        clearInterval(timer);
                        resolve();
                    }
                }, Lock.CHECK_INTERVAL_MS);
            });
        }

        this[SymCurr]++;

        return () => {
            this[SymCurr]--;
        };
    }

    /**
     * @static
     * @function all
     * @description A promise.all wrapper that will lock automatically for you
     * @memberof Lock#
     * @param {Promise[]} promises promise array
     * @param {object} options lock options
     * @returns {Promise<void>}
     *
     * @throws {TypeError}
     */
    static all(promises = [], options) {
        if (!Array.isArray(promises)) {
            throw new TypeError("promises must be an Array");
        }
        const Locker = new Lock(options);

        return Promise.all(promises.map(async(_p) => {
            const free = await Locker.acquireOne();
            try {
                await _p();
                free();
            }
            catch (err) {
                free();
            }
        }));
    }
}

Lock.CHECK_INTERVAL_MS = 1000;

module.exports = Lock;
