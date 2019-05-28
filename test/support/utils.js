/* --------------------
 * @overlook/load-routes
 * Tests utilities
 * ------------------*/

'use strict';

// Modules
const pathJoin = require('path').join;

// Exports
module.exports = {
	fixturePath,
	makeFixturePathFn,
	beforeOnce
};

const FIXTURES_PATH = pathJoin(__dirname, '..', 'fixtures');

function fixturePath(...args) {
	if (args.length === 0) return FIXTURES_PATH;
	return pathJoin(FIXTURES_PATH, ...args);
}

function makeFixturePathFn(...prefixes) {
	return function(...args) {
		return fixturePath(...prefixes, ...args);
	};
}

/**
 * Run before hook only once.
 * This is neccesary because Jest's built-in `beforeAll()` runs for every test, rather than just those
 * in the describe block in which it is declared.
 * I'm not sure if this is a bug, or intended behavior.
 * TODO Check if this still applies in Jest 24 when upgrade.
 * @param {function} fn - Set-up function
 * @returns {*} - Return value of `beforeEach()`
 */
function beforeOnce(fn) {
	let called = false;
	return beforeEach(function(...args) {
		if (called) return undefined;
		called = true;
		return fn.call(this, ...args); // eslint-disable-line no-invalid-this
	});
}
