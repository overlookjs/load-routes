/* --------------------
 * @overlook/load-routes module
 * Tests
 * ------------------*/

'use strict';

// Modules
const loadRoutes = require('../index');

// Init
require('./utils');

// Tests

describe('tests', () => {
	it.skip('all', () => { // eslint-disable-line jest/no-disabled-tests
		expect(loadRoutes).not.toBeUndefined();
	});
});
