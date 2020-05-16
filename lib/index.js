/* --------------------
 * @overlook/load-routes module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const pathSep = require('path').sep,
	assert = require('assert'),
	Route = require('@overlook/route'),
	{isRoute, isRouteClass} = Route,
	loadPlugin = require('@overlook/plugin-load'),
	{LOAD, PARENT_PATH} = loadPlugin,
	{isFullString, isObject} = require('is-it-type');

// Exports
module.exports = loadRoutes;

/**
 * Load routes from file system.
 * @param {string} path - Path to directory of route files
 * @param {Object} [options] - Options object
 * @param {function} [options.loader] - Route or Route class to use as loader
 * @returns {Promise<Route>} - Router object
 */
async function loadRoutes(path, options) {
	// Validate input
	assert(isFullString(path), 'path must be a non-empty string');

	if (options == null) {
		options = {};
	} else {
		assert(isObject(options), 'options must be an object if provided');
	}

	// Strip trailing slash from end of path
	if (path.slice(-1) === pathSep) return path.slice(0, -1);

	// Get and validate Class
	let {loader} = options;
	if (loader == null) {
		const Loader = Route.extend(loadPlugin);
		loader = new Loader();
	} else if (isRouteClass(loader)) {
		loader = new loader(); // eslint-disable-line new-cap
	} else {
		assert(isRoute(loader), 'loader option must be Route or Route class if provided');
	}

	// Load routes
	const root = await loader[LOAD](path);
	if (root) {
		root.parent = null;
		root[PARENT_PATH] = null;
	}

	return root;
}
