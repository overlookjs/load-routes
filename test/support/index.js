/* --------------------
 * @overlook/load-routes
 * Tests set-up
 * ------------------*/

/* eslint-disable node/exports-style, global-require */

'use strict';

// Throw any unhandled promise rejections
process.on('unhandledRejection', (err) => {
	throw err;
});

// Exports

/*
 * Reset require cache before each test.
 * `[LOAD]` uses `require()` internally to load route files
 * and then adds/mutates properties of the objects returned.
 * So without resetting the cache, tests get affected by mutations
 * performed in previous tests.
 *
 * '@overlook/route' and '@overlook/plugin-load' need to be loaded
 * anew too to ensure instance of `Route` used in the loaded route files
 * is same as the instance used in the test fixtures.
 */
beforeEach(() => {
	jest.resetModules();
	exports.Route = require('@overlook/route');
	exports.loadRoutes = require('@overlook/load-routes');
	exports.loadPlugin = require('@overlook/plugin-load');
});
