'use strict';
const os = require('os');
const fs = require('fs');
const path = require('path');

function parse(string) {
	const reBashHistory = /^: \d+:0;/;

	return string.trim().split('\n').map(x => {
		if (reBashHistory.test(x)) {
			return x.split(';').slice(1).join(';');
		}

		// ZSH just places one command on each line
		return x;
	});
}

function getPath(options) {
	options = options || {};

	if (process.platform === 'win32') {
		return '';
	}

	if (process.env.HISTFILE) {
		return process.env.HISTFILE;
	}

	const homeDir = os.homedir();

	const paths = new Set([
		path.join(homeDir, '.bash_history'),
		path.join(homeDir, '.zsh_history'),
		path.join(homeDir, '.history')
	]);

	if (options.extraPaths) {
		for (const path of options.extraPaths) {
			paths.add(path);
		}
	}

	return [...paths]
		.filter(path => fs.existsSync(path))
		.map(path => ({path, size: fs.statSync(path).size}))
		.reduce((a, b) => a.size > b.size ? a : b).path; // eslint-disable-line unicorn/no-reduce
}

module.exports = options => {
	options = options || {};

	if (process.platform === 'win32') {
		return [];
	}

	return parse(fs.readFileSync(getPath(options), 'utf8'));
};

module.exports.path = getPath;
module.exports.parse = parse;
