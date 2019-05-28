/* --------------------
 * @overlook/load-routes module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const readdir = require('recursive-readdir');

// Imports
const groupPaths = require('./groupPaths'),
	createTree = require('./createTree'),
	loadTree = require('./loadTree'),
	{trimTrailingSlash} = require('./paths'),
	{toArrayOfStrings} = require('./utils'),
	symbols = require('./symbols');

// Exports
module.exports = loadRoutes;
Object.assign(loadRoutes, symbols);

/**
 * Load routes from file system.
 * @param {string} path - Path to directory of route files
 * @param {Object} [options] - Options object
 * @param {string|Array<string>} [options.exts] - Extensions of root route file
 * @returns {Promise<Route>} - Router object
 */
async function loadRoutes(path, options) {
	// Strip '/' from end of path
	path = trimTrailingSlash(path);

	// Conform `options.exts`
	let {exts} = options || {};
	if (exts == null) {
		// Defaults
		exts = ['route.js', 'js'];
	} else {
		exts = toArrayOfStrings(exts);
	}

	// Get all paths
	const paths = await readdir(path, ['.DS_Store', '.*']);
	if (paths.length === 0) return null;

	// Group by extension
	const groupsMap = groupPaths(paths, path);

	// Turn groups into tree
	const rootGroup = createTree(groupsMap);

	// Load and build router tree
	return loadTree(rootGroup, groupsMap, exts);
}
