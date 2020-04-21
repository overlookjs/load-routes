/* --------------------
 * @overlook/load-routes module
 * Tests
 * `groupPaths()` unit tests
 * ------------------*/

'use strict';

// Imports
const groupPaths = require('../../lib/groupPaths.js');

// Init
require('../support/index.js');

// Tests

describe('groupPaths()', () => {
	describe('removes root path from returned paths', () => {
		it("root path ''", () => {
			const ret = groupPaths(['/a.js'], '');
			expect(ret).toEqual({'/a': {path: '/a', files: {js: '/a.js'}, children: []}});
		});

		it('longer root path', () => {
			const ret = groupPaths(['/a/b.js'], '/a');
			expect(ret).toEqual({'/b': {path: '/b', files: {js: '/a/b.js'}, children: []}});
		});
	});

	describe('extracts file extension from path', () => {
		it.each([
			['root level', '/a.js', '/a', 'js'],
			['1st level', '/a/b.js', '/a/b', 'js'],
			['2nd level', '/a/b/c.js', '/a/b/c', 'js'],
			['with multi-part extension', '/a.test.js', '/a', 'test.js'],
			["ending in '.'", '/a.', '/a', ''],
			['with no extension', '/a', '/a', ''],
			['with no basename', '/.js', '/', 'js'],
			["including '.'", '/a.a/b.js', '/a.a/b', 'js'],
			["including '.' and path ends with '.'", '/a.a/b.', '/a.a/b', ''],
			["including '.' and path has no extension", '/a.a/b', '/a.a/b', ''],
			["with '/index' on end of path", '/a/index.js', '/a', 'js']
		])('%s', (_, path, pathOut, ext) => {
			const ret = groupPaths([path], '');
			expect(ret).toEqual({[pathOut]: {path: pathOut, files: {[ext]: path}, children: []}});
		});
	});

	describe("removes '/index' from end of path", () => {
		it.each([
			['root level', '/index.js', '/', 'js'],
			['1st level', '/a/index.js', '/a', 'js'],
			['2nd level', '/a/b/index.js', '/a/b', 'js'],
			["'/index/index.js'", '/index/index.js', '/index', 'js']
		])('%s', (_, path, pathOut, ext) => {
			const ret = groupPaths([path], '');
			expect(ret).toEqual({[pathOut]: {path: pathOut, files: {[ext]: path}, children: []}});
		});
	});

	describe('groups together', () => {
		it('paths which are same except for extension', () => {
			const ret = groupPaths(['/a.js', '/a.jsx', '/b.js', '/b.jsx'], '');
			expect(ret).toEqual({
				'/a': {path: '/a', files: {js: '/a.js', jsx: '/a.jsx'}, children: []},
				'/b': {path: '/b', files: {js: '/b.js', jsx: '/b.jsx'}, children: []}
			});
		});

		it("paths with and without '/index' on end", () => {
			const ret = groupPaths(['/a.js', '/a/index.jsx'], '');
			expect(ret).toEqual({
				'/a': {path: '/a', files: {js: '/a.js', jsx: '/a/index.jsx'}, children: []}
			});
		});

		it('paths with single and multiple extensions', () => {
			const ret = groupPaths(['/a.js', '/a.test.js'], '');
			expect(ret).toEqual({
				'/a': {path: '/a', files: {js: '/a.js', 'test.js': '/a.test.js'}, children: []}
			});
		});
	});
});
