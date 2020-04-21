/* --------------------
 * @overlook/load-routes module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const readdir = require('recursive-readdir'),
	{isFunction} = require('core-util-is');

// Imports
const groupPaths = require('./groupPaths.js'),
	createTree = require('./createTree.js'),
	loadTree = require('./loadTree.js'),
	{trimTrailingSlash} = require('./paths.js'),
	{toArrayOfStrings} = require('./utils.js'),
	symbols = require('./symbols.js');

// Exports
module.exports = loadRoutes;
Object.assign(loadRoutes, symbols);

/**
 * Load routes from file system.
 * @param {string} path - Path to directory of route files
 * @param {Object} [options] - Options object
 * @param {function} [options.identify] - Function to identify routes.
 *   Will be called with args of form `('./relativePath', {js: '/path/to/file.js'})`.
 * @param {string|Array<string>} [options.exts] - Extensions of root route file
 * @returns {Promise<Route>} - Router object
 */
async function loadRoutes(path, options) {
	// Strip '/' from end of path
	path = trimTrailingSlash(path);

	// Conform options
	if (!options) options = {};

	let {identify} = options;
	if (identify != null) {
		if (!isFunction(identify)) throw new Error('options.identify must be a function if defined');
	} else {
		// Conform `options.exts`
		let {exts} = options;
		if (exts == null) {
		// Defaults
			exts = ['route.js', 'js'];
		} else {
			exts = toArrayOfStrings(exts);
		}

		// Create identify function
		// If it finds a file matching on of exts, returns that ext
		identify = function(relativePath, files) {
			return exts.find(ext => files[ext]) || null;
		};
	}

	// Get all paths
	const paths = await readdir(path, ['.DS_Store', '.*']);
	if (paths.length === 0) return null;

	// Group by extension
	const groupsMap = groupPaths(paths, path);

	// Turn groups into tree
	const rootGroup = createTree(groupsMap);

	// Load and build router tree
	return loadTree(rootGroup, groupsMap, identify);
}
