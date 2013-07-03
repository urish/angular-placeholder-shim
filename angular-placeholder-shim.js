/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

angular.module('placeholderShim', [])
	.directive('placeholder', function () {
		if (jQuery.placeholder.browser_supported()) {
			return {};
		}

		return function (scope, element) {
			var config = {
				color: '#888',
				cls: 'placeholder'
			};
			var shimCreated = false;
			if (element.is(':visible')) {
				element._placeholder_shim(config);
				shimCreated = true;
			}

			// The following line accounts for value changes from within the code
			scope.$watch(function () {
				if (!shimCreated && element.is(':visible')) {
					element._placeholder_shim(config);
					shimCreated = true;
				}
				if (shimCreated && !element.is(':focus')) {
					var overlay = element.data('placeholder');
					if (element.val().length) {
						overlay.hide();
					} else {
						overlay.show();
					}
				}
			});
		};
	});
