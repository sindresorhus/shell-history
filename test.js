import test from 'ava';
import m from './';

test(t => {
	t.true(m({extraPaths: ['./fixture']}).length > 0);
});
