import os from 'os';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

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
			return parseShellHistory(fs.readFileSync(historyPath, 'utf8'));
		}

		const {stdout} = childProcess.spawnSync('doskey', ['/history'], {encoding: 'utf8'});
		return stdout.trim().split('\r\n');
	}

	return parseShellHistory(fs.readFileSync(shellHistoryPath(options), 'utf8'));
}
