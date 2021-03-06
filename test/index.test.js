/* --------------------
 * @overlook/load-routes module
 * Tests
 * ------------------*/

'use strict';

// Modules
const pathJoin = require('path').join;

// Imports
const {getFixturePath, createGetChild, expectToBeFileWithPath} = require('./support/utils.js');

// Init
const modules = require('./support/index.js');

// Tests

// Refresh Route class and load plugin symbols before each test
let Route, loadRoutes, loadPlugin,
	INIT_PROPS, SRC_PATH, SRC_DIR_PATH, SRC_FILENAME, PARENT_PATH, FILES, IDENTIFY_ROUTE_FILE;
beforeEach(() => {
	({Route, loadRoutes, loadPlugin} = modules);
	INIT_PROPS = Route.INIT_PROPS;
	({SRC_PATH, SRC_DIR_PATH, SRC_FILENAME, PARENT_PATH, FILES, IDENTIFY_ROUTE_FILE} = loadPlugin);
});

describe('loads from folder', () => {
	describe('with no loader option', () => {
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
				expect(root.__filename).toBe(pathJoin(fixturePath, 'index.js'));
			});

			it('has name "root"', () => {
				expect(root.name).toBe('root');
			});

			it('has children array containing children', () => {
				expect(root.children).toBeArrayOfSize(1);
			});

			describe('has ancillary files', () => {
				it('route file', () => {
					expectToBeFileWithPath(root[FILES].js, pathJoin(fixturePath, 'index.js'));
				});

				it('file with another ext', () => {
					expectToBeFileWithPath(root[FILES].jsx, pathJoin(fixturePath, 'index.jsx'));
				});

				it('no other files', () => {
					expect(root[FILES]).toBeObject();
					expect(root[FILES]).toContainAllKeys(['js', 'jsx']);
				});
			});

			it('has [SRC_PATH] set to file path', () => {
				expect(root[SRC_PATH]).toBe(pathJoin(fixturePath, 'index.js'));
			});

			it('has [SRC_DIR_PATH] set to dir path', () => {
				expect(root[SRC_DIR_PATH]).toBe(fixturePath);
			});

			it('has [SRC_FILENAME] set to file name', () => {
				expect(root[SRC_FILENAME]).toBe('index');
			});
		});

		describe('peer route', () => {
			let route;
			beforeEach(() => { route = getChild('child'); });

			it('is a Route', () => {
				expect(route).toBeInstanceOf(Route);
			});

			it('is loaded from correct file', () => {
				expect(route.__filename).toBe(pathJoin(fixturePath, 'child.js'));
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
					expectToBeFileWithPath(route[FILES].js, pathJoin(fixturePath, 'child.js'));
				});

				it('file with another ext', () => {
					expectToBeFileWithPath(route[FILES].jsx, pathJoin(fixturePath, 'child.jsx'));
				});

				it('no other files', () => {
					expect(route[FILES]).toBeObject();
					expect(route[FILES]).toContainAllKeys(['js', 'jsx']);
				});
			});

			it('has [SRC_PATH] set to file path', () => {
				expect(route[SRC_PATH]).toBe(pathJoin(fixturePath, 'child.js'));
			});

			it('has [SRC_DIR_PATH] set to dir path', () => {
				expect(route[SRC_DIR_PATH]).toBe(fixturePath);
			});

			it('has [SRC_FILENAME] set to file name', () => {
				expect(route[SRC_FILENAME]).toBe('child');
			});
		});
	});

	describe('with loader option', () => {
		let fixturePath, root, getChild, HtmlRoute, HtmlIndexRoute;
		beforeEach(() => {
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
						if (isIndex) return HtmlIndexRoute;
						return HtmlRoute;
					}
					return null;
				}
			};

			fixturePath = getFixturePath('ancillary');
		});

		describe('as a Route class', () => {
			beforeEach(async () => {
				root = await loadRoutes(fixturePath, {loader: HtmlIndexRoute});
				getChild = createGetChild(root);
			});

			describeTests();
		});

		describe('as a route', () => {
			beforeEach(async () => {
				root = await loadRoutes(fixturePath, {loader: new HtmlIndexRoute()});
				getChild = createGetChild(root);
			});

			describeTests();
		});

		function describeTests() {
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
						expectToBeFileWithPath(root[FILES].html, pathJoin(fixturePath, 'index.html'));
					});

					it('no other files', () => {
						expect(root[FILES]).toBeObject();
						expect(root[FILES]).toContainAllKeys(['html']);
					});
				});

				it('has [SRC_PATH] undefined', () => {
					expect(root[SRC_PATH]).toBeUndefined();
				});

				it('has [SRC_DIR_PATH] set to dir path', () => {
					expect(root[SRC_DIR_PATH]).toBe(fixturePath);
				});

				it('has [SRC_FILENAME] set to file name', () => {
					expect(root[SRC_FILENAME]).toBe('index');
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
						expectToBeFileWithPath(route[FILES].html, pathJoin(fixturePath, 'child.html'));
					});

					it('no other files', () => {
						expect(route[FILES]).toBeObject();
						expect(route[FILES]).toContainAllKeys(['html']);
					});
				});

				it('has [SRC_PATH] undefined', () => {
					expect(route[SRC_PATH]).toBeUndefined();
				});

				it('has [SRC_DIR_PATH] set to dir path', () => {
					expect(route[SRC_DIR_PATH]).toBe(fixturePath);
				});

				it('has [SRC_FILENAME] set to file name', () => {
					expect(route[SRC_FILENAME]).toBe('child');
				});
			});
		}
	});
});
