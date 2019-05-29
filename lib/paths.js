/* --------------------
 * @overlook/load-routes module
 * Path manipulation functions
 * ------------------*/

'use strict';

// Modules
const pathJoinPosix = require('path').posix.join;

// Exports
module.exports = {
	trimTrailingSlash,
	pathName,
	pathParent,
	pathJoinRoute
};

function trimTrailingSlash(path) {
	if (path.slice(-1) === '/') return path.slice(0, -1);
	return path;
}

function pathName(path) {
	if (path === '/') return 'root';
	const index = path.lastIndexOf('/');
	return path.slice(index + 1);
}

function pathParent(path) {
	return pathJoinPosix(path, '..');
}

function pathJoinRoute(path, relativePath) {
	// Handle absolute paths
	const firstChar = relativePath[0];
	if (firstChar === '/') {
		if (relativePath === '/' || relativePath === '/index') return '/';
		return trimPath(relativePath);
	}

	// Handle relative paths with '.' or '..'
	if (firstChar === '.') {
		relativePath = trimPath(relativePath);
		return pathJoinPosix(path, '..', relativePath);
	}

	// Handle relative child paths e.g. 'view'
	if (relativePath === '' || relativePath === 'index') return path;
	relativePath = trimPath(relativePath);
	return pathJoinPosix(path, relativePath);
}

function trimPath(path) {
	// Trim '/' or '/index' off end of path
	if (path.slice(-1) === '/') return path.slice(0, -1);
	if (path.slice(-6) === '/index') return path.slice(0, -6);
	return path;
}
