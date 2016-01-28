'use strict';
const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = opts => {
	opts = opts || {};

	if (process.platform === 'win32') {
		return [];
	}

	const homeDir = os.homedir();

	const paths = new Set([
		path.join(homeDir, '.bash_history'),
		path.join(homeDir, '.zsh_history'),
		path.join(homeDir, '.history')
	]);

	if (process.env.HISTFILE) {
		paths.add(process.env.HISTFILE);
	}

	if (opts.extraPaths) {
		for (const path of opts.extraPaths) {
			paths.add(path);
		}
	}

	return Array.from(paths).map(fp => {
		let ret = [];

		try {
			ret = fs.readFileSync(fp, 'utf8').trim().split('\n');
		} catch (err) {}

		ret.path = fp;

		// handle bash history syntax
		ret = ret.map(x => /^: \d+:0;/.test(x) ? x.split(';').slice(1).join(';') : x);

		return ret;
	}).reduce((a, b) => a.length > b.length ? a : b);
};
