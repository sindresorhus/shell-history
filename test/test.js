import test from 'ava';
import shellHistory from '..';

process.chdir(__dirname);

test('main', t => {
	t.true(shellHistory({extraPaths: ['./fixture']}).length > 0);
});
