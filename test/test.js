import test from 'ava';
import {shellHistory} from '../index.js';

test('main', t => {
	t.true(shellHistory({extraPaths: ['./test/fixture']}).length > 0);
});
