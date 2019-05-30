/* --------------------
 * @overlook/load-routes module
 * Load router tree
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{isString} = require('core-util-is');

// Imports
const {pathName, pathJoinRoute, relativePathIsPeerOrAncestor} = require('./paths'),
	walkTree = require('./walkTree'),
	{LOAD_PATH, FILE_PATH, PARENT_PATH, IDENTIFY} = require('./symbols');

// Exports
class Loader {
	constructor(rootGroup, groupsMap, identifyTop) {
		this.rootGroup = rootGroup;
		this.groupsMap = groupsMap;
		this.identifyTop = identifyTop;
	}

	// TODO Write comment block about how processing works
	process() {
		// Add default props to all groups
		const {groupsMap} = this;
		for (const path in groupsMap) {
			const group = groupsMap[path];
			group.route = undefined;
			group.parentGroup = undefined;
		}

		// Identify + load root
		const {rootGroup, identifyTop} = this;
		const identifyResult = identifyTop('', rootGroup.files);
		if (!identifyResult) throw new Error('Root not found');
		const root = createRoute(rootGroup, identifyResult);

		if (root[PARENT_PATH] !== undefined) {
			throw new Error(`Root route cannot have [PARENT_PATH] defined (in ${root[FILE_PATH]})`);
		}

		// Load all routes
		walkTree(rootGroup, group => this.processSet(group));

		// Return root
		return root;
	}

	processSet(aboveGroup) {
		// For each group, identify route file / route class extension to use
		const {identifyTop, groupsMap} = this,
			aboveRoute = aboveGroup.route,
			groups = aboveGroup.children;
		for (const group of groups) {
			// Use `[IDENTIFY]` method of ancestors to determine ext / route class extension
			const {files, path} = group;
			let identifyResult,
				identifyingRoute = aboveRoute;
			while (true) { // eslint-disable-line no-constant-condition
				if (identifyingRoute[IDENTIFY]) {
					const relativePath = path.slice(identifyingRoute[LOAD_PATH].length + 1);
					identifyResult = identifyingRoute[IDENTIFY](relativePath, files);
					if (identifyResult) break;
				}
				identifyingRoute = identifyingRoute.parent;
				if (!identifyingRoute) break;
			}

			if (!identifyResult) {
				identifyResult = identifyTop(path.slice(1), files);
				if (!identifyResult) throw new Error(`Unable to identify route for ${group.files[Object.keys(group.files)[0]] || path}`);
			}

			// Create route for group
			const route = createRoute(group, identifyResult);

			// Identify parent route
			const parentRelativePath = route[PARENT_PATH];
			if (!parentRelativePath) {
				group.parentGroup = aboveGroup;
				continue;
			}

			if (!isString(parentRelativePath)) {
				throw new TypeError(`[PARENT_PATH] must be a string if defined (in ${route[FILE_PATH] || path})`);
			}

			// Check relative path is either a peer or an ancestor
			if (!relativePathIsPeerOrAncestor(parentRelativePath)) {
				throw new Error(`[PARENT_PATH] must point to a route above or a peer (in ${route[FILE_PATH] || path})`);
			}

			const parentPath = pathJoinRoute(path, parentRelativePath);
			const parentGroup = groupsMap[parentPath];

			// TODO Create new group and identify it instead of throwing error
			if (!parentGroup) {
				throw new Error(`Parent with relative path ${parentRelativePath} cannot be found for ${route[FILE_PATH] || path}`);
			}

			group.parentGroup = parentGroup;
		}

		// Join up routes to parents.
		// NB This has to be done after loop above as a route's parent may not be loaded before it
		// if they are peers in file system.
		for (const group of groups) {
			const parentRoute = group.parentGroup.route;
			parentRoute.attachChild(group.route);
		}
	}
}

function loadTree(rootGroup, groupsMap, identify) {
	const loader = new Loader(rootGroup, groupsMap, identify);
	return loader.process();
}

module.exports = loadTree;

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
		// Create route object with route class extension
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
