'use strict';
const os = require('os');
const fs = require('fs');
const path = require('path');

function parse(str) {
	const reBashHistory = /^: \d+:0;/;

	return str.trim().split('\n').map(x => {
		if (reBashHistory.test(x)) {
			return x.split(';').slice(1).join(';');
		}

		// ZSH just places one command on each line
		return x;
	});
}

function getPath(opts) {
	opts = opts || {};

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

	if (opts.extraPaths) {
		for (const path of opts.extraPaths) {
			paths.add(path);
		}
	}

	return Array.from(paths)
		.filter(fs.existsSync)
		.map(fp => ({fp, size: fs.statSync(fp).size}))
		.reduce((a, b) => a.size > b.size ? a : b).fp;
}

module.exports = opts => {
	opts = opts || {};

	if (process.platform === 'win32') {
		return [];
	}

	return parse(fs.readFileSync(getPath(opts), 'utf8'));
};

module.exports.path = getPath;
module.exports.parse = parse;
