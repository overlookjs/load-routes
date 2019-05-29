/* --------------------
 * @overlook/load-routes module
 * Load router tree
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	{isString} = require('core-util-is');

// Imports
const {pathName, pathParent, pathJoinRoute} = require('./paths'),
	walkTree = require('./walkTree'),
	{toArrayOfStrings, arrayDeleteIndex} = require('./utils'),
	{LOAD_PATH, FILE_PATH, CLAIM_CHILDREN, CHILD_CLASS, PARENT_PATH} = require('./symbols');

// Exports
class Loader {
	constructor(rootGroup, groupsMap) {
		this.rootGroup = rootGroup;
		this.groupsMap = groupsMap;
		this.claimedPathsMap = {};
		this.root = null;
	}

	// TODO Write comment block about how processing works.
	process(identify) {
		// Add default props to all groups.
		const {groupsMap} = this;
		for (const path in groupsMap) {
			const group = groupsMap[path];
			group.route = undefined;
			group.parentPath = undefined;
			group.parentGroup = undefined;
			group.inheritFromPath = pathParent(path);
		}

		// Identify root
		const {rootGroup} = this;
		const rootExt = identify('', rootGroup.files);
		if (!rootExt) throw new Error('Root not found');

		// Load root
		const root = this.load(rootGroup, rootExt);
		if (root[PARENT_PATH] !== undefined) {
			throw new Error(`Root route cannot have [PARENT_PATH] defined (in ${root[FILE_PATH]})`);
		}
		this.root = root;

		// Load all routes
		walkTree(rootGroup, group => this.processSet(group.children, identify));

		// Return root
		return root;
	}

	processSet(groups, identify) {
		// TODO Allow route to determine route exts for its folder rather than being globally defined
		// Load routes with a route file
		groups = [...groups];
		for (const group of groups) {
			const ext = identify(group.path.slice(1), group.files);
			if (!ext) continue;

			this.load(group, ext);
		}

		// Load routes for these groups.
		// Proceeds in multiple rounds of attempting to resolve parentage of all groups
		// and load routes for them.
		// Continues until all are loaded, or reaches dead end and cannot resolve them all.
		// `.processRound` removes groups from the array as they are loaded, so when `groups` is empty,
		// all are done.
		while (groups.length > 0) {
			const progress = this.processRound(groups);
			if (!progress) throw new Error(`Unable to resolve parentage for ${groups[0].path}`);
		}
	}

	processRound(groups) {
		// Establish parent path of loaded routes
		let progress = false;
		for (const group of groups) {
			const {route} = group;
			if (!route || group.parentPath !== undefined) continue;

			const parentRelativePath = route[PARENT_PATH];
			if (parentRelativePath === undefined) {
				// Parent not defined in route - check claimed paths
				const parentGroup = this.claimedPathsMap[group.path];
				if (!parentGroup) continue;

				group.parentGroup = parentGroup;
				group.parentPath = parentGroup.path;
			} else if (!isString(parentRelativePath)) {
				throw new TypeError(`[PARENT_PATH] must be a string if defined (in ${route[FILE_PATH]})`);
			} else {
				// Parent defined in route - find it
				group.parentPath = pathJoinRoute(group.path, parentRelativePath);
			}
			progress = true;
		}

		// Establish parent group
		for (const group of groups) {
			const {parentPath} = group;
			if (parentPath === undefined || group.parentGroup) continue;

			const parentGroup = this.findGroupByPath(parentPath);
			if (!parentGroup) continue;

			group.parentGroup = parentGroup;
			progress = true;
		}

		// Attach routes where parent group has a route
		for (let i = 0; i < groups.length; i++) {
			const group = groups[i],
				{route, parentGroup} = group;
			if (!route || !parentGroup) continue;

			const parent = parentGroup.route;
			if (!parent) continue;

			// Attach child to parent
			parent.attachChild(group.route);
			arrayDeleteIndex(groups, i);
			i--;
			progress = true;
		}

		if (progress) return true;

		// Create routes for groups with no route
		for (const group of groups) {
			if (group.route) continue;

			const inheritGroup = this.findGroupByPath(group.inheritFromPath);
			if (!inheritGroup) continue;

			const inheritRoute = inheritGroup.route;
			if (!inheritRoute[CHILD_CLASS]) continue;

			const extension = inheritRoute[CHILD_CLASS](group.files);
			if (!extension) continue;

			const RouteSubclass = Route.extend(extension);
			const route = new RouteSubclass();
			this.attachRouteToGroup(group, route);
			route[FILE_PATH] = null;
			progress = true;
		}

		if (progress) return true;

		// Set default parent
		for (const group of groups) {
			if (group.parentPath !== undefined) continue;

			group.parentPath = group.inheritFromPath;
			progress = true;
		}

		if (progress) return true;

		return false;
	}

	/**
	 * Load route file for group.
	 * @param {Object} group - Group
	 * @param {string} ext - Ext of route file (e.g. 'route.js')
	 * @returns {Route}
	 */
	load(group, ext) {
		const filePath = group.files[ext];
		// eslint-disable-next-line global-require, import/no-dynamic-require
		const route = require(filePath);
		this.attachRouteToGroup(group, route);
		route[FILE_PATH] = filePath;
		return route;
	}

	/**
	 * Attached route to group, set props on route, get paths this route claims as children.
	 * @param {Object} group - Group
	 * @param {Route} route - Route
	 * @returns {undefined}
	 */
	attachRouteToGroup(group, route) {
		// Save reference to route on group
		group.route = route;

		// Init route props
		const {path} = group;
		if (route.name == null) route.name = pathName(path);
		route.files = group.files;
		route[LOAD_PATH] = path;

		// Call `[CLAIM_CHILDREN]` to get paths this route claims as children.
		// Record claimed paths in `claimedPathsMap`.
		if (!route[CLAIM_CHILDREN]) return;

		let claimedPaths = route[CLAIM_CHILDREN]();
		if (claimedPaths == null) return;
		claimedPaths = toArrayOfStrings(claimedPaths);

		const routePath = route[LOAD_PATH],
			{claimedPathsMap} = this;
		for (let claimedPath of claimedPaths) {
			claimedPath = pathJoinRoute(routePath, claimedPath);
			if (!claimedPathsMap[claimedPath]) claimedPathsMap[claimedPath] = group;
		}
	}

	/**
	 * Find group by path.
	 * @param {string} path - Path
	 * @returns {Object} - Group
	 */
	findGroupByPath(path) {
		return this.groupsMap[path];
	}
}

function loadTree(rootGroup, groupsMap, identify) {
	const loader = new Loader(rootGroup, groupsMap);
	return loader.process(identify);
}

module.exports = loadTree;
