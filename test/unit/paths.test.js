/* --------------------
 * @overlook/load-routes module
 * Tests
 * paths functions unit tests
 * ------------------*/

'use strict';

// Imports
const {pathName, pathParent, pathJoinRoute} = require('../../lib/paths');

// Init
require('../support');

// Tests

describe('paths functions', () => {
	describe('`pathName()` transforms', () => {
		it.each([
			['/', 'root'],
			['/abc', 'abc'],
			['/abc/def', 'def'],
			['/abc/def/ghi', 'ghi']
		])('%j => %j', (path, name) => {
			expect(pathName(path)).toBe(name);
		});
	});

	describe('`pathParent()` transforms', () => {
		it.each([
			// TODO Test for when starting path is '/'
			['/abc', '/'],
			['/abc/def', '/abc'],
			['/abc/def/ghi', '/abc/def']
		])('%j => %j', (path, res) => {
			expect(pathParent(path)).toBe(res);
		});
	});

	describe('`pathJoinRoute()` transforms', () => {
		function itTransforms(cases) {
			it.each(cases)('%j + %j => %j', (path, relativePath, res) => {
				expect(pathJoinRoute(path, relativePath)).toBe(res);
			});
		}

		describe('relative local paths', () => {
			itTransforms([
				// TODO Tests for when starting path is '/'
				['/a', '.', '/'],
				['/a/b', '.', '/a'],
				['/a', './', '/'],
				['/a/b', './', '/a'],
				['/a', './index', '/'],
				['/a/b', './index', '/a'],
				['/a', './index/', '/'],
				['/a/b', './index/', '/a'],
				['/a', './x', '/x'],
				['/a/b', './x', '/a/x'],
				['/a', './x/', '/x'],
				['/a/b', './x/', '/a/x'],
				['/a', './x/index', '/x'],
				['/a/b', './x/index', '/a/x'],
				['/a', './x/index/', '/x'],
				['/a/b', './x/index/', '/a/x'],
				['/a', './x/y', '/x/y'],
				['/a/b', './x/y', '/a/x/y'],
				['/a', './x/y/', '/x/y'],
				['/a/b', './x/y/', '/a/x/y'],
				['/a', './x/y/index', '/x/y'],
				['/a/b', './x/y/index', '/a/x/y'],
				['/a', './x/y/index/', '/x/y'],
				['/a/b', './x/y/index/', '/a/x/y']
			]);
		});

		describe('relative parent paths', () => {
			itTransforms([
				// TODO Tests for when starting path is '/' or '/a'
				['/a/b', '..', '/'],
				['/a/b/c', '..', '/a'],
				['/a/b', '../', '/'],
				['/a/b/c', '../', '/a'],
				['/a/b', '../index', '/'],
				['/a/b/c', '../index', '/a'],
				['/a/b', '../index/', '/'],
				['/a/b/c', '../index/', '/a'],
				['/a/b', '../x', '/x'],
				['/a/b/c', '../x', '/a/x'],
				['/a/b', '../x/', '/x'],
				['/a/b/c', '../x/', '/a/x'],
				['/a/b', '../x/index', '/x'],
				['/a/b/c', '../x/index', '/a/x'],
				['/a/b', '../x/index/', '/x'],
				['/a/b/c', '../x/index/', '/a/x'],
				['/a/b', '../x/y', '/x/y'],
				['/a/b/c', '../x/y', '/a/x/y'],
				['/a/b', '../x/y/', '/x/y'],
				['/a/b/c', '../x/y/', '/a/x/y'],
				['/a/b', '../x/y/index', '/x/y'],
				['/a/b/c', '../x/y/index', '/a/x/y'],
				['/a/b', '../x/y/index/', '/x/y'],
				['/a/b/c', '../x/y/index/', '/a/x/y']
			]);
		});

		describe('relative child paths', () => {
			itTransforms([
				['/', '', '/'],
				['/a', '', '/a'],
				['/a/b', '', '/a/b'],
				['/', 'index', '/'],
				['/a', 'index', '/a'],
				['/a/b', 'index', '/a/b'],
				['/', 'index/', '/'],
				['/a', 'index/', '/a'],
				['/a/b', 'index/', '/a/b'],
				['/', 'x', '/x'],
				['/a', 'x', '/a/x'],
				['/a/b', 'x', '/a/b/x'],
				['/', 'x/', '/x'],
				['/a', 'x/', '/a/x'],
				['/a/b', 'x/', '/a/b/x'],
				['/', 'x/index', '/x'],
				['/a', 'x/index', '/a/x'],
				['/a/b', 'x/index', '/a/b/x'],
				['/', 'x/index/', '/x'],
				['/a', 'x/index/', '/a/x'],
				['/a/b', 'x/index/', '/a/b/x'],
				['/', 'x/y', '/x/y'],
				['/a', 'x/y', '/a/x/y'],
				['/a/b', 'x/y', '/a/b/x/y'],
				['/', 'x/y/', '/x/y'],
				['/a', 'x/y/', '/a/x/y'],
				['/a/b', 'x/y/', '/a/b/x/y'],
				['/', 'x/y/index', '/x/y'],
				['/a', 'x/y/index', '/a/x/y'],
				['/a/b', 'x/y/index', '/a/b/x/y'],
				['/', 'x/y/index/', '/x/y'],
				['/a', 'x/y/index/', '/a/x/y'],
				['/a/b', 'x/y/index/', '/a/b/x/y'],
				['/', '.x', '/.x'],
				['/a', '.x', '/a/.x'],
				['/a/b', '.x', '/a/b/.x'],
				['/', '.x/', '/.x'],
				['/a', '.x/', '/a/.x'],
				['/a/b', '.x/', '/a/b/.x'],
				['/', '.x/index', '/.x'],
				['/a', '.x/index', '/a/.x'],
				['/a/b', '.x/index', '/a/b/.x'],
				['/', '.x/index/', '/.x'],
				['/a', '.x/index/', '/a/.x'],
				['/a/b', '.x/index/', '/a/b/.x'],
				['/', '.x/y', '/.x/y'],
				['/a', '.x/y', '/a/.x/y'],
				['/a/b', '.x/y', '/a/b/.x/y'],
				['/', '.x/y/', '/.x/y'],
				['/a', '.x/y/', '/a/.x/y'],
				['/a/b', '.x/y/', '/a/b/.x/y'],
				['/', '.x/y/index', '/.x/y'],
				['/a', '.x/y/index', '/a/.x/y'],
				['/a/b', '.x/y/index', '/a/b/.x/y'],
				['/', '.x/y/index/', '/.x/y'],
				['/a', '.x/y/index/', '/a/.x/y'],
				['/a/b', '.x/y/index/', '/a/b/.x/y']
			]);
		});

		describe('absolute paths', () => {
			itTransforms([
				['/', '/', '/'],
				['/a', '/', '/'],
				['/a/b', '/', '/'],
				['/', '/index', '/'],
				['/a', '/index', '/'],
				['/a/b', '/index', '/'],
				['/', '/index/', '/'],
				['/a', '/index/', '/'],
				['/a/b', '/index/', '/'],
				['/', '/x', '/x'],
				['/a', '/x', '/x'],
				['/a/b', '/x', '/x'],
				['/', '/x/y', '/x/y'],
				['/a', '/x/y', '/x/y'],
				['/a/b', '/x/y', '/x/y'],
				['/', '/x/', '/x'],
				['/a', '/x/', '/x'],
				['/a/b', '/x/', '/x'],
				['/', '/x/index', '/x'],
				['/a', '/x/index', '/x'],
				['/a/b', '/x/index', '/x'],
				['/', '/x/index/', '/x'],
				['/a', '/x/index/', '/x'],
				['/a/b', '/x/index/', '/x']
			]);
		});
	});
});
