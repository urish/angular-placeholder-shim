/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		logLevel: config.LOG_INFO,
		browsers: ['PhantomJS'],
		reporters: ['dots', 'coverage'],
		singleRun: true,
		files: [
			'components/jquery/jquery.js',
			'components/angular/angular.js',
			'components/angular-mocks/angular-mocks.js',
			'components/jquery-html5-placeholder-shim/jquery.html5-placeholder-shim.js',
			'angular-placeholder-shim.js',
			'tests.js'
		],
		preprocessors: {
			'components/jquery-html5-placeholder-shim/jquery.html5-placeholder-shim.js': 'coverage',
			'angular-placeholder-shim.js': 'coverage'
		}
	});
};
