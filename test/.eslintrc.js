/* --------------------
 * @overlook/load-routes module
 * Tests ESLint config
 * ------------------*/

'use strict';

// Exports

module.exports = {
	extends: [
		'@overlookmotel/eslint-config-jest'
	],
	rules: {
		'import/no-unresolved': ['error', {ignore: ['^@overlook/load-routes$']}],
		'node/no-missing-require': ['error', {allowModules: ['@overlook/load-routes']}],
		'jest/expect-expect': ['error', {assertFunctionNames: ['expect', 'expectToBeFileWithPath']}]
	}
};
