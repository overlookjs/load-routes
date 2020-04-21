'use strict';

const Route = require('@overlook/route'),
	loadPlugin = require('@overlook/plugin-load');

const LoadRoute = Route.extend(loadPlugin);

module.exports = new LoadRoute({
	_path: '/'
});
