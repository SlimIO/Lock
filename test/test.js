// Require Third-party Dependencies
const avaTest = require("ava");

// Require Internal Dependencies
const Lock = require("../");
const is = require("@slimio/is");

avaTest("Export must be a class", (assert) => {
    assert.true(is.classObject(Lock));
    assert.is(Lock.name, "Lock");
});

avaTest("Trigger Lock manually", async(assert) => {
    const asyncLocker = new Lock({ maxConcurrent: 3 });
    let count = 0;

    async function npmInstall() {
        const free = await asyncLocker.acquireOne();
        try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            count++;
        }
        finally {
            free();
        }
    }

    await Promise.all([
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall()
    ]);
    assert.is(count, 5);
});

avaTest("Auto-lock with run method", async(assert) => {
    let count = 0;
    async function npmInstall() {
        await new Promise((resolve) => setTimeout(resolve, 100));
        count++;
    }

    await Lock.all([
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall()
    ], { maxConcurrent: 3 });

    assert.is(count, 5);
});

