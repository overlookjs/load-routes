# Changelog

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
