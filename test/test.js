// Require Third-party Dependencies
const avaTest = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const Lock = require("../");

avaTest("Export must be a class", (assert) => {
    assert.true(is.classObject(Lock));
    assert.is(Lock.name, "Lock");
});

avaTest("maxConcurrent must be typeof number", (assert) => {
    assert.throws(() => new Lock({ maxConcurrent: "10" }), {
        instanceOf: TypeError, message: "maxConcurrent must be a number"
    })
});

avaTest("Trigger Lock manually", async(assert) => {
    const asyncLocker = new Lock({ maxConcurrent: 3 });
    let count = 0;

    async function npmInstall() {
        const free = await asyncLocker.acquireOne();

        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        finally {
            free();
            count++;
        }
    }

    await Promise.all([
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
    ]);
    assert.is(count, 9);
});

avaTest("Trigger Lock with default maxConcurrent", async(assert) => {
    const asyncLocker = new Lock();
    asyncLocker.freeOne();
    let count = 0;

    async function npmInstall() {
        const free = await asyncLocker.acquireOne();

        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        finally {
            free();
            count++;
        }
    }

    await Promise.all([
        npmInstall(),
        npmInstall()
    ]);
    assert.is(count, 2);
});
