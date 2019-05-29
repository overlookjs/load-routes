/* --------------------
 * @overlook/load-routes module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	loadRoutes = require('../../index'),
	{LOAD_PATH, FILE_PATH} = loadRoutes;

// Init
require('../support');
const {makeFixturePathFn, beforeOnce} = require('../support/utils');

// Tests

describe('loads from folder', () => {
	describe('root', () => {
		const fixturePath = makeFixturePathFn('root');

		let router;
		beforeOnce(async () => {
			router = await loadRoutes(fixturePath());
		});

		it('route', () => {
			expect(router).toBeInstanceOf(Route);
			expect(router._path).toBe('/');
		});

		it('route.files is object', () => {
			expect(router.files).toBeObject();
		});

		it('route.files contains router file', () => {
			expect(router.files).toContainEntry(['route.js', fixturePath('index.route.js')]);
		});

		it('route.files contains attached files', () => {
			expect(router.files).toContainEntry(['jsx', fixturePath('index.jsx')]);
		});

		it('route.files contains no other entries', () => {
			expect(router.files).toContainAllKeys(['route.js', 'jsx']);
		});

		it('route.children is empty array', () => {
			expect(router.children).toBeArrayOfSize(0);
		});

		it('route[LOAD_PATH] is load path', () => {
			expect(router[LOAD_PATH]).toBe('/');
		});

		it('route[FILE_PATH] is file path', () => {
			expect(router[FILE_PATH]).toBe(fixturePath('index.route.js'));
		});
	});

	describe('child', () => {
		describe('parent defined in route file as', () => {
			for (const props of [
				{name: '.', path: 'dot'},
				{name: './', path: 'dotSlash'},
				{name: './index', path: 'dotSlashIndex'},
				{name: 'index', path: 'index'}
			]) {
				describe(`'${props.name}'`, () => {
					const fixturePath = makeFixturePathFn('children', 'parentDefined', props.path);

					let router, child;
					beforeOnce(async () => {
						router = await loadRoutes(fixturePath());
						child = ((router || {}).children || [])[0];
					});

					it('root route correct', () => {
						expect(router).toBeInstanceOf(Route);
						expect(router._path).toBe('/');
					});

					it('root.children contains child route', () => {
						const {children} = router;
						expect(children).toBeArrayOfSize(1);
						expect(child._path).toBe('/child');
					});

					it('child is Route class instance', () => {
						expect(child).toBeInstanceOf(Route);
					});

					it('child.parent is root', () => {
						expect(child.parent).toBe(router);
					});

					it('child[LOAD_PATH] is load path', () => {
						expect(child[LOAD_PATH]).toBe('/child');
					});

					it('child[FILE_PATH] is file path', () => {
						expect(child[FILE_PATH]).toBe(fixturePath('child.route.js'));
					});
				});
			}
		});

		describe('parent default', () => {
			const fixturePath = makeFixturePathFn('children', 'parentDefault');

			let router, child;
			beforeOnce(async () => {
				router = await loadRoutes(fixturePath());
				child = ((router || {}).children || [])[0];
			});

			it('root route correct', () => {
				expect(router).toBeInstanceOf(Route);
				expect(router._path).toBe('/');
			});

			it('root.children contains child route', () => {
				const {children} = router;
				expect(children).toBeArrayOfSize(1);
				expect(child._path).toBe('/child');
			});

			it('child is Route class instance', () => {
				expect(child).toBeInstanceOf(Route);
			});

			it('child.parent is root', () => {
				expect(child.parent).toBe(router);
			});

			it('child[LOAD_PATH] is load path', () => {
				expect(child[LOAD_PATH]).toBe('/child');
			});

			it('child[FILE_PATH] is file path', () => {
				expect(child[FILE_PATH]).toBe(fixturePath('child.route.js'));
			});
		});

		describe('claimed by parent', () => {
			const fixturePath = makeFixturePathFn('claim');

			let router, claimer, claimed;
			beforeOnce(async () => {
				router = await loadRoutes(fixturePath());
				claimer = ((router || {}).children || [])[0];
				claimed = ((claimer || {}).children || [])[0];
			});

			it('root route correct', () => {
				expect(router).toBeInstanceOf(Route);
				expect(router._path).toBe('/');
			});

			it('root.children contains claimer route', () => {
				const {children} = router;
				expect(children).toBeArrayOfSize(1);
				expect(claimer._path).toBe('/claimer');
			});

			it('claimer.children contains claimed route', () => {
				const {children} = claimer;
				expect(children).toBeArrayOfSize(1);
				expect(claimed._path).toBe('/claimer/claimed');
			});

			it('claimed is Route class instance', () => {
				expect(claimed).toBeInstanceOf(Route);
			});

			it('claimed.parent is claimer', () => {
				expect(claimed.parent).toBe(claimer);
			});

			it('claimed[LOAD_PATH] is load path', () => {
				expect(claimed[LOAD_PATH]).toBe('/claimed');
			});

			it('claimed[FILE_PATH] is file path', () => {
				expect(claimed[FILE_PATH]).toBe(fixturePath('claimed.route.js'));
			});
		});
	});
});
