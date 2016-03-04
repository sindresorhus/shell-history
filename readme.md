# shell-history [![Build Status](https://travis-ci.org/sindresorhus/shell-history.svg?branch=master)](https://travis-ci.org/sindresorhus/shell-history)

> Get the command history of the user's [shell](https://en.wikipedia.org/wiki/Shell_(computing))


## Install

```
$ npm install --save shell-history
```


## Usage

```js
const shellHistory = require('shell-history');

console.log(shellHistory());
//=> ['ava', 'echo unicorn', 'node', 'npm test', ...]

console.log(shellHistory.path());
//=> '/Users/sindresorhus/.history'
```


## API

### shellHistory()

Get an array of commands.

On Windows it will always be an empty array as command history is not persisted there.

### shellHistory.path()

Get the path of the file containing the shell history.

### shellHistory.parse(string)

Parse a shell history string into an array of commands.


## Related

- [shell-path](https://github.com/sindresorhus/shell-path) - Get the $PATH from the shell
- [shell-env](https://github.com/sindresorhus/shell-env) - Get environment variables from the shell


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
