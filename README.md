[![NPM version](https://img.shields.io/npm/v/@overlook/load-routes.svg)](https://www.npmjs.com/package/@overlook/load-routes)
[![Build Status](https://img.shields.io/travis/overlookjs/load-routes/master.svg)](http://travis-ci.org/overlookjs/load-routes)
[![Dependency Status](https://img.shields.io/david/overlookjs/load-routes.svg)](https://david-dm.org/overlookjs/load-routes)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookjs/load-routes.svg)](https://david-dm.org/overlookjs/load-routes)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookjs/load-routes.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookjs/load-routes/master.svg)](https://coveralls.io/r/overlookjs/load-routes)

# Load Overlook routes from files

Part of the [Overlook framework](https://overlookjs.github.io/).

## Usage

### Introduction

[Overlook](https://overlookjs.github.io/) conceptualizes routes as a tree, with routes connected to each other in parent-child relationships.

For example, `/bands/albums`'s parent is `/bands`, and in turn `/bands`'s parent is `/`. `/bands` has `/bands/albums` as it's child, along with e.g. `/bands/members`.

This plugin allows defining a hierarchy of routes via another hierarchical structure - the file system.

### Loading routes

Use this module to load a directory containing route files.

```js
const loadRoutes = require('@overlook/load-routes');
const router = await loadRoutes( __dirname + '/routes' );
```

`loadRoutes` looks for a file called `index.js` or `index.route.js` in that directory and will load it as the root route.

The root route should be extended with [@overlook/plugin-load](https://www.npmjs.com/package/@overlook/plugin-load) to turn it into a "loader", and then it can define how further files should be loaded.

See more details [here](https://www.npmjs.com/package/@overlook/plugin-load).

### Base loader

You can also provide a base loader Route class which is used to load the root. Loader should be extended with [@overlook/plugin-load](https://www.npmjs.com/package/@overlook/plugin-load).

For example, if all your routes serve plain HTML files, you can just fill the routes directory with HTML files, and provide a Loader class to make routes from them.

```js
const Overlook = require('@overlook/core');
const Route = require('@overlook/route');
const loadRoutes = require('@overlook/load-routes');
const loadPlugin = require('@overlook/plugin-load');
const { IDENTIFY_ROUTE_FILE, FILES } = loadPlugin;
const fs = require('fs').promises;

class HtmlRoute extends Route {
  // NB This is a simplification. Also need to use something
  // like @overlook/plugin-path to route requests.
  async handle( { res } ) {
    const html = await fs.readFile( this[FILES].html );
    req.res.end( html );
  }
}

const HtmlLoadRoute = HtmlRoute.extend( loadPlugin );

class HtmlIndexRoute extends HtmlLoadRoute {
  [IDENTIFY_ROUTE_FILE]( exts, isIndex, name ) {
    // Delegate to superior plugins
    const identified = super[IDENTIFY_ROUTE_FILE]( exts, isIndex, name );
    if ( identified ) return identified;

    // Create a route using HtmlRoute class for HTML files
    if ( exts.html ) {
      if ( isIndex ) return { Class: HtmlIndexRoute };
      return { Class: HtmlRoute };
    }

    // No HTML file found
    return null;
  }
}

const router = await loadRoutes(
  __dirname + '/routes',
  { Loader: HtmlIndexRoute }
);
```

## Versioning

This module follows [semver](https://semver.org/). Breaking changes will only be made in major version updates.

All active NodeJS release lines are supported (v10+ at time of writing). After a release line of NodeJS reaches end of life according to [Node's LTS schedule](https://nodejs.org/en/about/releases/), support for that version of Node may be dropped at any time, and this will not be considered a breaking change. Dropping support for a Node version will be made in a minor version update (e.g. 1.2.0 to 1.3.0). If you are using a Node version which is approaching end of life, pin your dependency of this module to patch updates only using tilde (`~`) e.g. `~1.2.3` to avoid breakages.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookjs/load-routes/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookjs/load-routes/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add tests for new features
* document new functionality/API additions in README
* do not add an entry to Changelog (Changelog is created when cutting releases)
