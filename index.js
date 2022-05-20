/* eslint-disable lines-between-class-members */
"use strict";

// Require Node.js Dependencies
const EventEmitter = require("events");

// CONSTANTS
const kRejectionMessage = "Lock acquisition rejected!";

/**
 * @callback LockHandler
 * @returns {void}
 */

class Lock extends EventEmitter {
    #rejected = false;
    #waitings = [];
    #max = 5;
    #current = 0;

    /**
     * @class Lock
     * @memberof Lock#
     * @param {object} options options
     * @param {number} [options.maxConcurrent=5] maximum concurrent lock
     *
     * @throws {TypeError}
     */
    constructor(options = Object.create(null)) {
        super();
        const { maxConcurrent = 5 } = options;
        if (typeof maxConcurrent !== "number") {
            throw new TypeError("maxConcurrent must be a number");
        }

        this.#max = maxConcurrent;
    }

    /**
     * @member {number} max
     * @memberof Lock#
     * @returns {number}
     */
    get max() {
        return this.#max;
    }

    /**
     * @member {number} running
     * @memberof Lock#
     * @returns {number}
     */
    get running() {
        return this.#current;
    }

    /**
     * @function rejectAll
     * @description reject all running/waiting promises and locks!
     * @param {string} [errorMessage]
     * @memberof Lock#
     * @returns {void}
     */
    rejectAll(errorMessage) {
        this.#rejected = true;
        const localErrorMessage = typeof errorMessage === "string" ? errorMessage : kRejectionMessage;

        while (this.#current > 0) {
            this.freeOne(new Error(localErrorMessage));
        }
    }

    /**
     * @function reset
     * @description reset all locks (will reject active locks and promises).
     * @memberof Lock#
     * @returns {void}
     */
    reset() {
        if (this.#current > 0) {
            this.rejectAll();
        }
        this.#rejected = false;
    }

    /**
     * @async
     * @function acquireOne
     * @description Acquire one spot on the locks pool.
     * @memberof Lock#
     * @returns {Promise<LockHandler>}
     */
    async acquireOne() {
        if (this.#rejected) {
            throw new Error(kRejectionMessage);
        }

        if (this.#current >= this.max) {
            await new Promise((resolve, reject) => this.#waitings.push([resolve, reject]));
        }
        this.#current++;

        return () => this.freeOne();
    }

    /**
     * @function freeOne
     * @memberof Lock#
     * @param {Error} [error=null]
     * @returns {void}
     */
    freeOne(error = null) {
        if (this.running > 0) {
            this.emit("freeOne");
            this.#current--;
            const promiseArg = this.#waitings.shift();
            if (typeof promiseArg === "undefined") {
                return;
            }

            const [resolve, reject] = promiseArg;
            if (resolve && error === null) {
                resolve();
            }
            else {
                reject(error || new Error(kRejectionMessage));
            }
        }
    }
}

module.exports = Lock;
