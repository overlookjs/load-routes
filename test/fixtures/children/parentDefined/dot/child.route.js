'use strict';

const Route = require('@overlook/route'),
	{PARENT_PATH} = require('@overlook/load-routes');

module.exports = new Route({
	_path: '/child',

	[PARENT_PATH]: '.'
});
