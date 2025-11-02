import test from 'ava';
import {shellHistory} from '../index.js';

test('main', t => {
	const originalHistfile = process.env.HISTFILE;

	try {
		process.env.HISTFILE = './test/fixture';
		t.true(shellHistory().length > 0);
	} finally {
		if (originalHistfile === undefined) {
			delete process.env.HISTFILE;
		} else {
			process.env.HISTFILE = originalHistfile;
		}
	}
});

test('ZSH metafied history with Chinese characters', t => {
	const originalHistfile = process.env.HISTFILE;

	try {
		process.env.HISTFILE = './test/zsh-chinese-fixture';

		const history = shellHistory();

		const expected = [
			'echo "这是一段中文"',
			'ls 文件.txt',
			'cat 测试.md'
		];

		t.deepEqual(history, expected);
	} finally {
		if (originalHistfile === undefined) {
			delete process.env.HISTFILE;
		} else {
			process.env.HISTFILE = originalHistfile;
		}
	}
});
