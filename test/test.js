import test from 'ava';
import shellHistory from '..';

test('main', t => {
	t.true(shellHistory({extraPaths: ['./fixture']}).length > 0);
});
