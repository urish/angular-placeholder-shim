/* angular-placeholder-shim version 0.2.1
 * License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

angular.module('placeholderShim', [])
	.directive('placeholder', ['$interpolate', '$timeout', function ($interpolate, $timeout) {
		if (jQuery.placeholder.browser_supported()) {
			return {};
		}

		return function (scope, element) {
			var config = {
				color: '#888',
				cls: 'placeholder'
			};

			var interpolatedPlaceholder = $interpolate(element.attr('placeholder'));
			var placeholderText = null;

			var overlay = null;
			if (element.is(':visible')) {
				$timeout(function(){
					element._placeholder_shim(config);
					overlay = element.data('placeholder');
				}, 300);
			}

			// The following code accounts for value changes from within the code
			// and for dynamic changes in placeholder text
			scope.$watch(function () {
				if (!overlay && element.is(':visible')) {
					$timeout(function(){
						element._placeholder_shim(config);
						overlay = element.data('placeholder');
					}, 300);
				}
				if (overlay && (element.get(0) !== document.activeElement)) {
					if (element.val().length) {
						overlay.hide();
					} else {
						overlay.show();
					}
				}
				if (overlay) {
					var newText = interpolatedPlaceholder(scope);
					if (newText !== placeholderText) {
						placeholderText = newText;
						overlay.text(placeholderText);
					}
				}
			});
		};
	}]);
