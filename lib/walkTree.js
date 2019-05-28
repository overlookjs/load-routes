/* --------------------
 * @overlook/load-routes module
 * walkTree function
 * ------------------*/

'use strict';

// Exports

/**
 * Walk tree and call callback on each node.
 * @param {Object} node - Tree node with `.children` array
 * @param {function} fn - Function to call on each tree node
 */
module.exports = walkTree;

function walkTree(node, fn) {
	fn(node);

	for (const child of node.children) {
		walkTree(child, fn);
	}
}
