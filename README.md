# Lock
![version](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

SlimIO Asynchronous Handler Mutex "Like" Lock. This package has been created to easily lock parallel execution of JavaScript Asynchronous function.

## Requirements
- [Node.js](https://nodejs.org/en/) v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/lock
# or
$ yarn add @slimio/lock
```

## Usage example
```js
const Lock = require("@slimio/lock");

const asyncLocker = new Lock({ maxConcurrent: 3 });

async function npmInstall() {
    const free = await asyncLocker.acquireOne();
    try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("npm install resolved!");
    }
    finally {
        free();
    }
}

// Run 3 per 3 methods
Promise.all([
    npmInstall(),
    npmInstall(),
    npmInstall(),
    npmInstall(),
    npmInstall()
]).then(() => console.log("all done!")).catch(console.error);
```

## API

<details><summary>lock(): Promise< Lock.LockHandler ></summary>
<br />
Create a new lock counter. Return a function that you need to execute to free the counter/lock.

</details>

<details><summary>static all(promises: Promise[], options?: Lock.Options): Promise< any ></summary>
<br />

Same as Promise.all but with all Lock mechanism automatically handled for you.

```js
async function npmInstall() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log("npm install done!");
}

await Lock.all([
    npmInstall(),
    npmInstall(),
    npmInstall(),
    npmInstall(),
    npmInstall()
], { maxConcurrent: 3 });
```
</details>

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/is](https://github.com/SlimIO/is)|Minor|Low|Type checker|

## License
MIT
