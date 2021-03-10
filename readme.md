# shell-history

> Get the command history of the user's [shell](https://en.wikipedia.org/wiki/Shell_(computing))

## Install

```
$ npm install shell-history
```

## Usage

```js
import {shellHistory, shellHistoryPath} from 'shell-history';

console.log(shellHistory());
//=> ['ava', 'echo unicorn', 'node', 'npm test', …]

console.log(shellHistoryPath());
//=> '/Users/sindresorhus/.history'
```

## API

### shellHistory()

Get an array of commands.

On Windows, unless the `HISTFILE` environment variable is set, this will only return commands from the current session.

### shellHistoryPath()

Get the path of the file containing the shell history.

On Windows, this will return either the `HISTFILE` environment variable or `undefined`.

### parseShellHistory(string)

Parse a shell history string into an array of commands.

## Related

- [shell-path](https://github.com/sindresorhus/shell-path) - Get the $PATH from the shell
- [shell-env](https://github.com/sindresorhus/shell-env) - Get environment variables from the shell
