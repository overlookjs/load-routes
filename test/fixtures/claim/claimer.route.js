'use strict';

const Route = require('@overlook/route'),
	{PARENT_PATH, CLAIM_CHILDREN} = require('@overlook/load-routes');

module.exports = new Route({
	_path: '/claimer',

	[PARENT_PATH]: './',

	[CLAIM_CHILDREN]() {
		return './claimed';
	}
});
