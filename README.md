# Lock
![version](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

SlimIO Asynchronous Lock Handler

## Requirements
- Node.js v10 or higher

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

const asyncLocker = new Lock({ max: 3 });

async function npmInstall() {
    const free = await asyncLocker.lock();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("npm install resolved!");
    free();
}

async function main() {
    // Run 3 per 3 methods
    await Promise.all([
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall(),
        npmInstall()
    ]);
}
main().catch(console.error);
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
], { max: 3 });
```
</details>

## Dependencies
This project have no dependencies.

## License
MIT
