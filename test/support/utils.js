/* --------------------
 * @overlook/load-routes
 * Tests utilities
 * ------------------*/

'use strict';

// Modules
const pathJoin = require('path').join;

// Constants
const FIXTURES_PATH = pathJoin(__dirname, '..', 'fixtures');

// Exports

module.exports = {
	getFixturePath,
	createGetChild
};

function getFixturePath(...parts) {
	return pathJoin(FIXTURES_PATH, ...parts);
}

function createGetChild(route) {
	return (...names) => getChild(route, ...names);
}

function getChild(route, ...names) {
	for (const name of names) {
		route = route.children.find(child => child.name === name);
		if (!route) return undefined;
	}
	return route;
}
