'use strict';

const Route = require('@overlook/route'),
	{PARENT_PATH} = require('../../../../../index.js');

module.exports = new Route({
	_path: '/child',

	[PARENT_PATH]: '.'
});
