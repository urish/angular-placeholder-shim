/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

describe('Directive: placeholder', function () {
	var originalPlaceholderBrowserSupported = jQuery.placeholder.browser_supported;
	var originalPlaceholderShim = jQuery.fn._placeholder_shim;
	var element;

	beforeEach(module(function($provide) {
		element = null;
		spyOn(jQuery.fn, '_placeholder_shim').andCallThrough();
	}));

	beforeEach(module('placeholderShim'));

	afterEach(function() {
		jQuery.placeholder.browser_supported = originalPlaceholderBrowserSupported;
		jQuery.fn._placeholder_shim = originalPlaceholderShim;
		if (element) {
			element.remove();
		}
	});

	describe('in browsers which natively support placeholders', function() {
		beforeEach(function() {
			jQuery.placeholder.browser_supported = function() {return true};
		});

		it('should not call the placeholder-shim plugin', inject(function ($rootScope, $compile) {
			element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			expect(jQuery.fn._placeholder_shim).not.toHaveBeenCalled();
		}));
	});

	describe('in browsers with no placeholders support', function(){
		beforeEach(function() {
			jQuery.placeholder.browser_supported = function() {return false};
		});

		it('should call the placeholder-shim plugin', inject(function ($rootScope, $compile) {
			element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			expect(jQuery.fn._placeholder_shim).toHaveBeenCalled();
		}));

		it('should create an overlay for the placeholder', inject(function ($rootScope, $compile) {
			var element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			expect(element.data('placeholder')).toBeDefined();
		}));

		it('should call the shim when the element first becomes visible', inject(function ($rootScope, $compile) {
			var element = angular.element('<input placeholder="foobar" />');
			expect(jQuery.fn._placeholder_shim).not.toHaveBeenCalled();
			element = $compile(element)($rootScope);
			angular.element('body').append(element);
			$rootScope.$digest();
			expect(jQuery.fn._placeholder_shim).toHaveBeenCalled();
		}));

		it('should hide the placeholder when the input gets a value', inject(function ($rootScope, $compile) {
			var element = angular.element('<input placeholder="foobar" />');
			expect(jQuery.fn._placeholder_shim).not.toHaveBeenCalled();
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			var placeholder = element.data('placeholder');
			expect(placeholder.is(':visible')).toBeTruthy();
			element.val('something');
			$rootScope.$digest();
			expect(placeholder.is(':visible')).toBeFalsy();
		}));

		it('should show the placeholder when the input is empty', inject(function ($rootScope, $compile) {
			var element = angular.element('<input placeholder="foobar" value="something" />');
			expect(jQuery.fn._placeholder_shim).not.toHaveBeenCalled();
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			var placeholder = element.data('placeholder');
			expect(placeholder.is(':visible')).toBeFalsy();
			element.val('');
			$rootScope.$digest();
			expect(placeholder.is(':visible')).toBeTruthy();
		}));
	});
});
