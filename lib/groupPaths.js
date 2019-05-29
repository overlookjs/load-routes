/* --------------------
 * @overlook/load-routes module
 * groupPaths function
 * ------------------*/

'use strict';

// Modules
const pathSeparator = require('path').sep;

// Exports

// Construct regex for splitting path into body and extension
const regexpSep = pathSeparator === '/' ? '/' : '\\\\',
	pathRegexp = new RegExp(`^((?:(?:.*)${regexpSep})?(?:[^.${regexpSep}]*))(?:\\.([^${regexpSep}]*))?$`);

/**
 * Group paths.
 *
 * [ 'a.js', 'a.jsx', 'b.js', 'b/index.jsx', 'b/c.test.js' ] =>
 * {
 *   a: { path: 'a', files: { js: 'a.js', jsx: 'a.jsx' }, children: [] },
 *   b: { path: 'b', files: { js: 'b.js', jsx: 'b/index.jsx' }, children: [] },
 *   'b/c': { path: 'b/c', files: { 'test.js': 'b/c.test.js' }, children: [] }
 * }
 *
 * @param {Array<string>} paths - Array of file paths - must not have trailing slashes
 * @param {string} rootPath - Root path of routes directory - must not have trailing slash
 * @returns {Object} - Hash of groups, keyed by path
 */
module.exports = function(paths, rootPath) {
	const rootPathLength = rootPath.length;

	const groupsMap = {};
	for (const filePath of paths) {
		// Extract file extension
		let [, path, ext] = filePath.slice(rootPathLength).match(pathRegexp);
		if (ext === undefined) ext = '';

		// Convert with Windows paths (backslashes) to UNIX-style (forward slashes)
		if (pathSeparator === '\\') {
			if (path.includes('/')) throw new Error("Paths must not include '/'");
			path = path.split('\\').join('/');
		} else if (path.includes('\\')) {
			throw new Error("Paths must not include '\\'");
		}

		// Remove 'index' from end of paths
		if (path.slice(-6) === '/index') path = path.slice(0, -6);
		if (path === '') path = '/';

		let group = groupsMap[path];
		let files;
		if (!group) {
			files = {};
			group = {path, files, children: []};
			groupsMap[path] = group;
		} else {
			files = group.files;
		}

		if (files[ext]) {
			throw new Error(`Two files map to same path and extension: '${files[ext]}' and '${filePath}'`);
		}

		files[ext] = filePath;
	}

	return groupsMap;
};
