# Changelog

## 0.3.0

Breaking changes:

* Default loader creates route with `[FILES]` object containing `File` objects

Tests:

* Simplify paths

Dev:

* Update dev dependencies

## 0.2.2

Minor:

* Drop support for Node v13

Dependencies:

* Update dependencies
* Replace `assert` with `simple-invariant`

Dev:

* Update dev dependencies

## 0.2.1

Dependencies:

* Update plugin dependencies

Dev:

* Update dev dependencies

## 0.2.0

Breaking changes:

* `loader` option replaces `Loader`

Dependencies:

* Update `@overlook/plugin-load` dependency
* Replace `simple-invariant` with `assert`

Dev:

* Update dev dependencies

Docs:

* Fix example [fix]

## 0.1.2

Bug fixes:

* Correctly validate loaders

Deps:

* Update `@overlook/route` + `@overlook/plugin-load` dependencies
* Update `is-it-type` dependency
* Replace `tiny-invariant` with `simple-invariant`

Dev:

* Run coverage on CI on Node 14
* `test-prod` NPM script
* Simplify lint scripts
* Update dev dependencies

## 0.1.1

Deps:

* Update dependencies

Docs:

* Remove references to `@overlook/core`

## 0.1.0

Breaking changes:

* Use `@overlook/plugin-load`

Dev:

* Run tests on CI on Node v14

## 0.0.5

Breaking changes:

* Drop support for Node v8

Refactor:

* Full paths in requires

Tests:

* Run tests in dev mode
* Import from package name [refactor]
* Simplify unhandled rejection handling

Dev:

* Run tests on CI on Node v13
* Update dev dependencies
* Simplify Jest config
* ESLint config update
* `.editorconfig` config
* Replace `.npmignore` with `files` list in `package.json`
* Remove unnecessary line from `.gitignore`
* Travis CI config remove `sudo` key

No code:

* Config file header comments

Docs:

* Add missing changelog entry [fix]
* Update license year

## 0.0.4

Features:

* Handle paths ending 'index/' as if no 'index/' suffix
* Routes above define default route class or file extension
* Create missing routes

Bug fixes:

* Handle relative paths starting with '.' correctly

Refactor:

* Remove `Loader` class

Dependencies:

* Update `@overlook/route` dependency

## 0.0.3

Features:

* Relative paths support absolute paths and child paths
* `identify` option

Bug fixes:

* Route `.name` correct

Tests:

* Unit tests for `pathParent` function

Docs:

* Fix missing changelog entry

## 0.0.2

Breaking changes:

* `[LOAD_PATH]`s start with '/'

Refactor:

* Improve readability of regex

Tests:

* Fix typo in test name

## 0.0.1

* Initial release
