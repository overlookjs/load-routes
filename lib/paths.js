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
	const index = path.indexOf('/');
	if (index === -1) {
		if (path === '') return 'root';
		return path;
	}
	return path.slice(index + 1);
}

function pathParent(path) {
	return pathJoinSimple(path, '..');
}

function pathJoinRoute(path, relativePath) {
	// Strip off trailing '/' or '/index'
	relativePath = relativePath.match(/^(.*?)(?:\/|\/index)?$/)[1];
	if (relativePath === 'index') relativePath = '';
	return pathJoinSimple(path, '..', relativePath);
}

function pathJoinSimple(...parts) {
	const outPath = pathJoinPosix(...parts);
	if (outPath === '.') return '';
	return outPath;
}
