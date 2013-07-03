/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

module.exports = function (grunt) {
	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		ngmin: {
			dist: {
				files: {
					'angular-placeholder-shim.min.js': 'angular-placeholder-shim.js'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'angular-placeholder-shim.min.js': 'angular-placeholder-shim.min.js'
				}
			}
		}
	});

	grunt.registerTask('test', [
		'karma'
	]);

	grunt.registerTask('build', [
		'ngmin',
		'uglify'
	]);

	grunt.registerTask('default', ['build']);
};
