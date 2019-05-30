/* --------------------
 * @overlook/load-routes module
 * Load router tree
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{isString} = require('core-util-is');

// Imports
const {pathName, pathParent, pathJoinRoute, relativePathIsPeerOrAncestor} = require('./paths'),
	walkTree = require('./walkTree'),
	{LOAD_PATH, FILE_PATH, PARENT_PATH, IDENTIFY} = require('./symbols');

// Exports

// TODO Write comment block about how processing works

module.exports = function(rootGroup, groupsMap, identifyGlobal) {
	// Add default props to all groups
	for (const path in groupsMap) {
		const group = groupsMap[path];
		group.route = undefined;
		group.pendingChildRoutes = [];
	}

	// Identify + load/create root route
	const identifyResult = identifyGlobal('', rootGroup.files);
	if (!identifyResult) throw new Error('Unable to identify root route');
	const root = createRoute(rootGroup, identifyResult);

	if (root[PARENT_PATH] !== undefined) {
		throw new Error(`Root route cannot have [PARENT_PATH] defined${root[FILE_PATH] ? ` (in ${root[FILE_PATH]})` : ''}`);
	}

	// Load all routes
	walkTree(rootGroup, group => processSet(group, groupsMap, identifyGlobal));

	// Return root
	return root;
};

function processSet(aboveGroup, groupsMap, identifyGlobal) {
	// For each group, identify route file / route class extension to use
	for (const group of aboveGroup.children) {
		processGroup(group, aboveGroup, groupsMap, identifyGlobal);
	}
}

function processGroup(group, aboveGroup, groupsMap, identifyGlobal) {
	// Use `[IDENTIFY]` method of ancestors to determine ext / route class extension.
	// Try closest ancestor first, then next one down, all the way to root.
	const {files, path} = group;
	let identifyResult,
		identifyingRoute = aboveGroup.route;
	while (true) { // eslint-disable-line no-constant-condition
		if (identifyingRoute[IDENTIFY]) {
			const relativePath = path.slice(identifyingRoute[LOAD_PATH].length + 1);
			identifyResult = identifyingRoute[IDENTIFY](relativePath, files);
			if (identifyResult) break;
		}
		identifyingRoute = identifyingRoute.parent;
		if (!identifyingRoute) break;
	}

	// If no ancestor identified route, use global identify function
	if (!identifyResult) {
		identifyResult = identifyGlobal(path.slice(1), files);
		if (!identifyResult) throw new Error(`Unable to identify route for ${group.files[Object.keys(group.files)[0]] || path}`);
	}

	// Create route for group
	const route = createRoute(group, identifyResult);

	// Attach pending children
	// i.e. File system peers which are children of this route, but were processed before this one.
	for (const child of group.pendingChildRoutes) {
		route.attachChild(child);
	}

	// Identify parent route
	const parentRelativePath = route[PARENT_PATH];
	if (parentRelativePath == null) {
		// Default parent path is `./` i.e. attach to route above
		aboveGroup.route.attachChild(route);
		return;
	}

	if (!isString(parentRelativePath)) {
		throw new TypeError(`[PARENT_PATH] must be a string if defined (in ${route[FILE_PATH] || path})`);
	}

	// Check relative path is either a peer or an ancestor
	if (!relativePathIsPeerOrAncestor(parentRelativePath)) {
		throw new Error(`[PARENT_PATH] must point to a route above or a peer (in ${route[FILE_PATH] || path})`);
	}

	const parentPath = pathJoinRoute(path, parentRelativePath);
	let parentGroup = groupsMap[parentPath];
	if (!parentGroup) parentGroup = createGroup(path, groupsMap, identifyGlobal);

	// Attach to child
	const parentRoute = parentGroup.route;
	if (parentRoute) {
		// Parent group has route - attach to it
		parentRoute.attachChild(route);
	} else {
		// Parent group does not have route yet.
		// Must be because it's a file system peer in the set currently processing, but this group
		// was processed before the parent.
		// Add to pending array to be attached to parent route once it's created.
		parentGroup.pendingChildRoutes.push(route);
	}
}

function createGroup(path, groupsMap, identifyGlobal) {
	// Create group with no files
	const group = {path, files: {}, children: [], route: undefined, pendingChildRoutes: []};
	groupsMap[path] = group;

	// Find group above
	const abovePath = pathParent(path);
	let aboveGroup = groupsMap[abovePath];
	if (aboveGroup) aboveGroup = createGroup(abovePath, groupsMap, identifyGlobal);

	// Get route for this new group
	processGroup(group, aboveGroup, groupsMap, identifyGlobal);

	return group;
}

/**
 * Group identified.
 * Load route or create route class.
 * @param {Object} group - Group
 * @param {string|function} identifyResult - Result from `[IDENTIFY]()`
 */
function createRoute(group, identifyResult) {
	// Get route - load or create from class
	let route, filePath;
	if (isString(identifyResult)) {
		// File identified as route file - load it
		filePath = group.files[identifyResult];
		// eslint-disable-next-line global-require, import/no-dynamic-require
		route = require(filePath);
	} else {
		// Create route object using route class extension
		const RouteClass = Route.extend(identifyResult);
		route = new RouteClass();
		filePath = null;
	}

	// Save reference to route on group
	group.route = route;

	// Init route props
	const {path} = group;
	if (route.name == null) route.name = pathName(path);
	route.files = group.files;
	route[LOAD_PATH] = path;
	route[FILE_PATH] = filePath;

	return route;
}
