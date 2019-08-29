# Lock
![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/SlimIO/Lock/master/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/Lock/commit-activity)
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

### Properties

```ts
declare class Lock {
    public readonly max: number;
    public readonly running: number;
}
```

### Methods

<details><summary>acquireOne(): Promise< () => void ></summary>
<br />
Create a new lock counter. Return a function that you need to execute to free the counter/lock.

</details>

<details><summary>freeOne(): void</summary>
<br />
free an acquired lock (or do nothing if there is no lock acquired yet).

</details>

## Dependencies

This project have no dependencies.

## License
MIT
