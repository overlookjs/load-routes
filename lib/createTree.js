/* --------------------
 * @overlook/load-routes module
 * createTree function
 * ------------------*/

'use strict';

// Imports
const {pathParent} = require('./paths'),
	walkTree = require('./walkTree');

// Exports

/**
 * Convert groups hash object into a tree.
 *
 * {'': { path: '' }, a: { path: 'a' }, 'a/b': { path: 'a/b' }, b: { path: 'b' } }
 * =>
 * { path: '', children: [
 *   { path: 'a', children: [
 *     { path: 'a/b', children: [] }
 *   ] },
 *   { path: 'b', children: [] }
 * ] }
 *
 * If any groups are missing (e.g. 'a/b', but no 'a'), they are created with empty files object.
 *
 * @param {Object} groupsMap - Hash of groups, keyed by path
 * @returns {Object|null} - Root group (or null if no groups)
 */
module.exports = function(groupsMap) {
	// Construct tree
	for (const path in groupsMap) {
		const group = groupsMap[path];
		joinToParent(group, path, groupsMap);
	}

	// Get root
	const root = groupsMap['/'];
	if (!root) return null;

	// Walk tree and order children of each node
	walkTree(root, node => (
		node.children.sort(
			(group1, group2) => (group1.path > group2.path ? 1 : -1)
		)
	));

	// Return root
	return root;
};

/**
 * Join group to its parent group.
 * If parent group does not exist, create it (with empty files object).
 * @param {Object} group
 * @param {string} path
 * @param {Object} groupsMap - Hash of groups, keyed by path
 */
function joinToParent(group, path, groupsMap) {
	if (path === '/') return;

	const parentPath = pathParent(path);
	let parentGroup = groupsMap[parentPath];
	if (!parentGroup) {
		parentGroup = {path: parentPath, files: {}, children: []};
		groupsMap[parentPath] = parentGroup;
		joinToParent(parentGroup, parentPath, groupsMap);
	}

	parentGroup.children.push(group);
}
