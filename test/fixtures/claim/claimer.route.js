'use strict';

const Route = require('@overlook/route'),
	{PARENT_PATH, CLAIM_CHILDREN} = require('../../../index.js');

module.exports = new Route({
	_path: '/claimer',

	[PARENT_PATH]: './',

	[CLAIM_CHILDREN]() {
		return './claimed';
	}
});
