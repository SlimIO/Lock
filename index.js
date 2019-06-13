// Require Third-party Package
const is = require("@slimio/is");

// SYMBOLS
const SymMax = Symbol("SymMax");
const SymCurr = Symbol("SymCurr");

/**
 * @callback LockHandler
 * @returns {void}
 */

/**
 * @class Lock
 * @classdesc Asynchronous Lock
 */
class Lock {
    /**
     * @constructor
     * @memberof Lock#
     * @param {Object} options options
     * @param {Number} [options.maxConcurrent=5] maximum concurrent lock
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
     * @member {Number} max
     * @memberof Lock#
     */
    get max() {
        return this[SymMax];
    }

    /**
     * @async
     * @method lock
     * @memberof Lock#
     * @returns {Promise<LockHandler>}
     */
    async lock() {
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
     * @method all
     * @memberof Lock#
     * @param {Promise[]} promises promise array
     * @param {Object} options lock options
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
            const free = await Locker.lock();
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
