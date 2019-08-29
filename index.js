"use strict";

// SYMBOLS
const SymMax = Symbol("SymMax");
const SymCurr = Symbol("SymCurr");
const SymWaits = Symbol("SymWaits");

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
        const { maxConcurrent = 5 } = options;
        if (typeof maxConcurrent !== "number") {
            throw new TypeError("maxConcurrent must be a number");
        }

        Object.defineProperty(this, SymWaits, { value: [] });
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
     * @member {number} running
     * @memberof Lock#
     * @returns {number}
     */
    get running() {
        return this[SymCurr];
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
            await new Promise((resolve) => this[SymWaits].push(resolve));
        }
        this[SymCurr]++;

        return this.freeOne.bind(this);
    }

    /**
     * @function freeOne
     * @memberof Lock#
     * @returns {void}
     */
    freeOne() {
        if (this.running - 1 < this.max) {
            const resolve = this[SymWaits].shift();
            this[SymCurr]--;
            resolve && resolve();
        }
    }
}

Lock.CHECK_INTERVAL_MS = 1000;

module.exports = Lock;
