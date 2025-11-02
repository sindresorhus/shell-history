import os from 'os';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

/**
Unmetafy a buffer that contains ZSH metafied data.

ZSH uses metafication to store non-ASCII bytes: each byte >= 0x80 is stored as 0x83 (Meta character) followed by (byte ^ 0x20).

@see https://www.zsh.org/mla/users/2011/msg00154.html
@param {Buffer} buffer - The metafied buffer to decode.
@returns {Buffer} The unmetafied buffer.
*/
function unmetafy(buffer) {
	const result = [];

	for (let index = 0; index < buffer.length; index++) {
		const byte = buffer[index];

		if (byte === 0x83 && index + 1 < buffer.length) {
			// Meta character found - XOR next byte with 0x20 to get original
			result.push(buffer[index + 1] ^ 0x20);
			index++; // Skip next byte
		} else {
			result.push(byte);
		}
	}

	return Buffer.from(result);
}

function readAndParseHistoryFile(filePath) {
	const buffer = fs.readFileSync(filePath);
	const unmetafied = unmetafy(buffer);
	return parseShellHistory(unmetafied.toString('utf8'));
}

export function parseShellHistory(string) {
	const reBashHistory = /^: \d+:0;/;

	return string.trim().split('\n').map(line => {
		if (reBashHistory.test(line)) {
			return line.split(';').slice(1).join(';');
		}

		// ZSH just places one command on each line
		return line;
	});
}

export function shellHistoryPath({extraPaths = []} = {}) {
	if (process.env.HISTFILE) {
		return process.env.HISTFILE;
	}

	const homeDir = os.homedir();

	const paths = new Set([
		path.join(homeDir, '.bash_history'),
		path.join(homeDir, '.zsh_history'),
		path.join(homeDir, '.history')
	]);

	for (const path of extraPaths) {
		paths.add(path);
	}

	const filterdHistoryPath = () => {
		let largestFile;
		let size = 0;

		for (const path of paths) {
			if (!fs.existsSync(path)) {
				continue;
			}

			if (fs.statSync(path).size > size) {
				size = fs.statSync(path).size;
				largestFile = path;
			}
		}

		return largestFile;
	};

	return filterdHistoryPath();
}

export function shellHistory(options = {}) {
	if (process.platform === 'win32') {
		const historyPath = shellHistoryPath(options);
		if (historyPath) {
			return readAndParseHistoryFile(historyPath);
		}

		const {stdout} = childProcess.spawnSync('doskey', ['/history'], {encoding: 'utf8'});
		return stdout.trim().split('\r\n');
	}

	return readAndParseHistoryFile(shellHistoryPath(options));
}
