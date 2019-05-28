/* --------------------
 * @overlook/load-routes module
 * Utility functions
 * ------------------*/

'use strict';

// Modules
const {isString, isArray} = require('core-util-is');

// Exports
// TODO Move all these into NPM modules
module.exports = {
	toArrayOfStrings,
	toArrayOfType,
	arrayDeleteIndex
};

function toArrayOfStrings(o) {
	return toArrayOfType(o, (item) => {
		if (!isString(item)) throw new TypeError('Expected string or array of strings');
	});
}

function toArrayOfType(o, validate) {
	if (o == null) return [];

	if (!isArray(o)) {
		validate(o);
		return [o];
	}

	for (const item of o) {
		validate(item);
	}

	return o;
}

function arrayDeleteIndex(arr, index) {
	arr.splice(index, 1);
	return arr;
}
