/* --------------------
 * @overlook/load-routes module
 * Tests
 * ------------------*/

'use strict';

// Modules
const pathJoin = require('path').join;

// Imports
const {getFixturePath, createGetChild} = require('./support/utils.js');

// Init
const modules = require('./support/index.js');

// Tests

// Refresh Route class and load plugin symbols before each test
let Route, loadRoutes, loadPlugin,
	INIT_PROPS, LOAD_PATH, LOAD_DIR_PATH, PARENT_PATH, FILES, IDENTIFY_ROUTE_FILE;
beforeEach(() => {
	({Route, loadRoutes, loadPlugin} = modules);
	INIT_PROPS = Route.INIT_PROPS;
	({LOAD_PATH, LOAD_DIR_PATH, PARENT_PATH, FILES, IDENTIFY_ROUTE_FILE} = loadPlugin);
});

describe('loads from folder', () => {
	describe('with no Class option', () => {
		let fixturePath, root, getChild;
		beforeEach(async () => {
			fixturePath = getFixturePath('main');
			root = await loadRoutes(fixturePath);
			getChild = createGetChild(root);
		});

		describe('root route', () => {
			it('is a Route', () => {
				expect(root).toBeInstanceOf(Route);
			});

			it('is loaded from correct file', () => {
				expect(root._path).toBe('/');
			});

			it('has name "root"', () => {
				expect(root.name).toBe('root');
			});

			it('has children array containing children', () => {
				expect(root.children).toBeArrayOfSize(1);
			});

			describe('has ancillary files', () => {
				it('route file', () => {
					expect(root[FILES].js).toBe(pathJoin(fixturePath, 'index.js'));
				});

				it('file with another ext', () => {
					expect(root[FILES].jsx).toBe(pathJoin(fixturePath, 'index.jsx'));
				});

				it('no other files', () => {
					expect(root[FILES]).toBeObject();
					expect(root[FILES]).toContainAllKeys(['js', 'jsx']);
				});
			});

			it('has [LOAD_PATH] set to file path', () => {
				expect(root[LOAD_PATH]).toBe(pathJoin(fixturePath, 'index.js'));
			});

			it('has [LOAD_DIR_PATH] set to dir path', () => {
				expect(root[LOAD_DIR_PATH]).toBe(fixturePath);
			});
		});

		describe('peer route', () => {
			let route;
			beforeEach(() => { route = getChild('child'); });

			it('is a Route', () => {
				expect(route).toBeInstanceOf(Route);
			});

			it('is loaded from correct file', () => {
				expect(route._path).toBe('/child');
			});

			it('has name according to file name', () => {
				expect(route.name).toBe('child');
			});

			it('has root as parent', () => {
				expect(route.parent).toBe(root);
			});

			it('has [PARENT_PATH] as ./', () => {
				expect(route[PARENT_PATH]).toBe('./');
			});

			it('has empty children array', () => {
				expect(route.children).toBeArrayOfSize(0);
			});

			describe('has ancillary files', () => {
				it('route file', () => {
					expect(route[FILES].js).toBe(pathJoin(fixturePath, 'child.js'));
				});

				it('file with another ext', () => {
					expect(route[FILES].jsx).toBe(pathJoin(fixturePath, 'child.jsx'));
				});

				it('no other files', () => {
					expect(route[FILES]).toBeObject();
					expect(route[FILES]).toContainAllKeys(['js', 'jsx']);
				});
			});

			it('has [LOAD_PATH] set to file path', () => {
				expect(route[LOAD_PATH]).toBe(pathJoin(fixturePath, 'child.js'));
			});

			it('has [LOAD_DIR_PATH] set to dir path', () => {
				expect(route[LOAD_DIR_PATH]).toBe(fixturePath);
			});
		});
	});

	describe('with Loader option', () => {
		let fixturePath, root, getChild, HtmlRoute, HtmlIndexRoute;
		beforeEach(async () => {
			HtmlRoute = class extends Route {
				[INIT_PROPS](props) {
					super[INIT_PROPS](props);
					this.isHtmlRoute = true;
				}
			};

			const HtmlLoadRoute = HtmlRoute.extend(loadPlugin);

			HtmlIndexRoute = class extends HtmlLoadRoute {
				[INIT_PROPS](props) {
					super[INIT_PROPS](props);
					this.isHtmlLoaderRoute = true;
				}

				[IDENTIFY_ROUTE_FILE](exts, isIndex, name) {
					const res = super[IDENTIFY_ROUTE_FILE](exts, isIndex, name);
					if (res) return res;
					if (exts.html) {
						if (isIndex) return {Class: HtmlIndexRoute};
						return {Class: HtmlRoute};
					}
					return null;
				}
			};

			fixturePath = getFixturePath('ancillary');
			root = await loadRoutes(fixturePath, {Loader: HtmlIndexRoute});
			getChild = createGetChild(root);
		});

		describe('root route', () => {
			it('is a Route', () => {
				expect(root).toBeInstanceOf(Route);
			});

			it('has name "root"', () => {
				expect(root.name).toBe('root');
			});

			it('has children array containing children', () => {
				expect(root.children).toBeArrayOfSize(1);
			});

			it('is created from specified class', () => {
				expect(root).toBeInstanceOf(HtmlRoute);
				expect(root).toBeInstanceOf(HtmlIndexRoute);
				expect(root.isHtmlRoute).toBeTrue();
				expect(root.isHtmlLoaderRoute).toBeTrue();
			});

			describe('has ancillary files', () => {
				it('file with another ext', () => {
					expect(root[FILES].html).toBe(pathJoin(fixturePath, 'index.html'));
				});

				it('no other files', () => {
					expect(root[FILES]).toBeObject();
					expect(root[FILES]).toContainAllKeys(['html']);
				});
			});

			it('has [LOAD_PATH] set to dir path with class name', () => {
				expect(root[LOAD_PATH]).toBe(pathJoin(fixturePath, '<HtmlIndexRoute>'));
			});

			it('has [LOAD_DIR_PATH] set to dir path', () => {
				expect(root[LOAD_DIR_PATH]).toBe(fixturePath);
			});
		});

		describe('peer route', () => {
			let route;
			beforeEach(() => { route = getChild('child'); });

			it('is a Route', () => {
				expect(route).toBeInstanceOf(Route);
			});

			it('has name according to file name', () => {
				expect(route.name).toBe('child');
			});

			it('has root as parent', () => {
				expect(route.parent).toBe(root);
			});

			it('has [PARENT_PATH] as ./', () => {
				expect(route[PARENT_PATH]).toBe('./');
			});

			it('has empty children array', () => {
				expect(route.children).toBeArrayOfSize(0);
			});

			it('is created from specified class', () => {
				expect(route).toBeInstanceOf(HtmlRoute);
				expect(route).not.toBeInstanceOf(HtmlIndexRoute);
				expect(route.isHtmlRoute).toBeTrue();
				expect(route.isHtmlLoaderRoute).toBeUndefined();
			});

			describe('has ancillary files', () => {
				it('file with another ext', () => {
					expect(route[FILES].html).toBe(pathJoin(fixturePath, 'child.html'));
				});

				it('no other files', () => {
					expect(route[FILES]).toBeObject();
					expect(route[FILES]).toContainAllKeys(['html']);
				});
			});

			it('has [LOAD_PATH] set to dir path with class name', () => {
				expect(route[LOAD_PATH]).toBe(pathJoin(fixturePath, '<HtmlRoute>'));
			});

			it('has [LOAD_DIR_PATH] set to dir path', () => {
				expect(route[LOAD_DIR_PATH]).toBe(fixturePath);
			});
		});
	});
});
