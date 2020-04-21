/* --------------------
 * @overlook/load-routes module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const pathSep = require('path').sep,
	Route = require('@overlook/route'),
	loadPlugin = require('@overlook/plugin-load'),
	{LOAD, PARENT_PATH} = loadPlugin,
	{isFullString, isObject} = require('is-it-type'),
	invariant = require('tiny-invariant').default;

// Exports
module.exports = loadRoutes;

/**
 * Load routes from file system.
 * @param {string} path - Path to directory of route files
 * @param {Object} [options] - Options object
 * @param {function} [options.Loader] - Route class to use as loader
 * @returns {Promise<Route>} - Router object
 */
async function loadRoutes(path, options) {
	// Validate input
	invariant(isFullString(path), 'path must be a non-empty string');

	if (options == null) {
		options = {};
	} else {
		invariant(isObject(options), 'options must be an object if provided');
	}

	// Strip trailing slash from end of path
	if (path.slice(-1) === pathSep) return path.slice(0, -1);

	// Get and validate Class
	let {Loader} = options;
	if (Loader == null) {
		Loader = Route.extend(loadPlugin);
	} else {
		invariant(isSubclassOf(Loader, Route), 'Loader option must be subclass of Route class');
	}

	// Load routes
	const loader = new Loader();
	const root = await loader[LOAD](path);
	if (root) {
		root.parent = null;
		root[PARENT_PATH] = null;
	}

	return root;
}

function isSubclassOf(SubClass, Class) {
	return SubClass !== Class && Object.getPrototypeOf(SubClass) !== Class;
}
