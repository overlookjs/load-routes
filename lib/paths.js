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
	pathJoinRoute,
	relativePathIsPeerOrAncestor
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
	if (relativePath[0] === '/') {
		relativePath = trimPath(relativePath);
		return relativePath === '' ? '/' : relativePath;
	}

	// Handle relative paths with '.' or '..'
	if (/^\.\.?(\/|$)/.test(relativePath)) {
		relativePath = trimPath(relativePath);
		return pathJoinPosix(path, '..', relativePath);
	}

	// Handle relative child paths e.g. 'view'
	if (['', 'index', 'index/'].includes(relativePath)) return path;
	relativePath = trimPath(relativePath);
	return pathJoinPosix(path, relativePath);
}

function relativePathIsPeerOrAncestor(relativePath) {
	return /^\.\.?(\/\.\.?)*(\/[^/]+)?(\/|\/index\/?)?$/.test(relativePath);
}

function trimPath(path) {
	// Trim '/' or '/index' off end of path
	if (path.slice(-7) === '/index/') return path.slice(0, -7);
	if (path.slice(-6) === '/index') return path.slice(0, -6);
	if (path.slice(-1) === '/') return path.slice(0, -1);
	return path;
}
