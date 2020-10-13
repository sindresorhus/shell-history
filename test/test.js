import test from 'ava';
import shellHostory from '..';

test('main', t => {
	t.true(shellHostory({extraPaths: ['./fixture']}).length > 0);
});
