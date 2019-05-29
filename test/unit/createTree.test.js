/* --------------------
 * @overlook/load-routes module
 * Tests
 * `createTree()` unit tests
 * ------------------*/

'use strict';

// Imports
const createTree = require('../../lib/createTree');

// Init
require('../support');

// Tests

describe('createTree()', () => {
	it('returns null if no groups', () => {
		const ret = createTree({});
		expect(ret).toBeNull();
	});

	function createGroupsMap(paths) {
		const groupsMap = {};
		for (const path of paths) {
			groupsMap[path] = {path, children: []};
		}
		return groupsMap;
	}

	describe('nests children within parent', () => {
		it('child to root', () => {
			const ret = createTree(createGroupsMap(['/', '/a']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{path: '/a', children: []}
				]
			});
		});

		it('child to root with child first', () => {
			const ret = createTree(createGroupsMap(['/a', '/']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{path: '/a', children: []}
				]
			});
		});

		it('2 children to root', () => {
			const ret = createTree(createGroupsMap(['/', '/a', '/b']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{path: '/a', children: []},
					{path: '/b', children: []}
				]
			});
		});

		it('child to child', () => {
			const ret = createTree(createGroupsMap(['/', '/a', '/a/b']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{
						path: '/a',
						children: [
							{path: '/a/b', children: []}
						]
					}
				]
			});
		});

		it('child to child to child', () => {
			const ret = createTree(createGroupsMap(['/', '/a', '/a/b', '/a/b/c']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{
						path: '/a',
						children: [
							{
								path: '/a/b',
								children: [
									{path: '/a/b/c', children: []}
								]
							}
						]
					}
				]
			});
		});
	});

	describe('creates missing nodes', () => {
		it('root missing', () => {
			const ret = createTree(createGroupsMap(['/a']));
			expect(ret).toEqual({
				path: '/',
				files: {},
				children: [
					{path: '/a', children: []}
				]
			});
		});

		it('child missing', () => {
			const ret = createTree(createGroupsMap(['/', '/a/b']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{
						path: '/a',
						files: {},
						children: [
							{path: '/a/b', children: []}
						]
					}
				]
			});
		});

		it('root and child missing', () => {
			const ret = createTree(createGroupsMap(['/a/b']));
			expect(ret).toEqual({
				path: '/',
				files: {},
				children: [
					{
						path: '/a',
						files: {},
						children: [
							{path: '/a/b', children: []}
						]
					}
				]
			});
		});

		it('2 children missing', () => {
			const ret = createTree(createGroupsMap(['/', '/a/b/c']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{
						path: '/a',
						files: {},
						children: [
							{
								path: '/a/b',
								files: {},
								children: [
									{path: '/a/b/c', children: []}
								]
							}
						]
					}
				]
			});
		});

		it('root and 2 children missing', () => {
			const ret = createTree(createGroupsMap(['/a/b/c']));
			expect(ret).toEqual({
				path: '/',
				files: {},
				children: [
					{
						path: '/a',
						files: {},
						children: [
							{
								path: '/a/b',
								files: {},
								children: [
									{path: '/a/b/c', children: []}
								]
							}
						]
					}
				]
			});
		});
	});

	describe('orders children', () => {
		it('root level', () => {
			const ret = createTree(createGroupsMap(['/', '/b', '/a']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{path: '/a', children: []},
					{path: '/b', children: []}
				]
			});
		});

		it('root level with 2nd level children', () => {
			const ret = createTree(createGroupsMap(['/', '/b', '/a', '/b/x', '/a/x']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{
						path: '/a',
						children: [
							{path: '/a/x', children: []}
						]
					},
					{
						path: '/b',
						children: [
							{path: '/b/x', children: []}
						]
					}
				]
			});
		});

		it('2nd level', () => {
			const ret = createTree(createGroupsMap(['/', '/a/c', '/a/b', '/a']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{
						path: '/a',
						children: [
							{path: '/a/b', children: []},
							{path: '/a/c', children: []}
						]
					}
				]
			});
		});

		it('2nd level with 3rd level children', () => {
			const ret = createTree(createGroupsMap(['/', '/a/c', '/a/b', '/a', '/a/c/x', '/a/b/x']));
			expect(ret).toEqual({
				path: '/',
				children: [
					{
						path: '/a',
						children: [
							{
								path: '/a/b',
								children: [
									{path: '/a/b/x', children: []}
								]
							},
							{
								path: '/a/c',
								children: [
									{path: '/a/c/x', children: []}
								]
							}
						]
					}
				]
			});
		});
	});
});
