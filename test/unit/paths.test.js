/* --------------------
 * @overlook/load-routes module
 * Tests
 * paths functions unit tests
 * ------------------*/

'use strict';

// Imports
const {pathName} = require('../../lib/paths');

// Init
require('../support');

// Tests

describe('paths functions', () => {
	describe('pathName', () => {
		it.each([
			['/', 'root'],
			['/abc', 'abc'],
			['/abc/def', 'def'],
			['/abc/def/ghi', 'ghi']
		])('path %j => name %j', (path, name) => {
			expect(pathName(path)).toBe(name);
		});
	});
});
