/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

describe('Directive: placeholder', function () {
	var originalPlaceholderBrowserSupported = jQuery.placeholder.browser_supported;
	var originalPlaceholderShim = jQuery.fn._placeholder_shim;
	var originalHasFocus = document.hasFocus;
	var element;

	beforeEach(module(function($provide) {
		element = null;
		// We override document.hasFocus() so that jquery.is('focus') will not check if.
		document.hasFocus = undefined;
		spyOn(jQuery.fn, '_placeholder_shim').andCallThrough();
	}));

	beforeEach(module('placeholderShim'));

	afterEach(function() {
		jQuery.placeholder.browser_supported = originalPlaceholderBrowserSupported;
		jQuery.fn._placeholder_shim = originalPlaceholderShim;
		document.hasFocus = originalHasFocus;
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
			$rootScope.someValue = '';
			var element = angular.element('<input placeholder="foobar" ng-model="someValue" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			var placeholder = element.data('placeholder');
			$rootScope.$digest();
			expect(placeholder.is(':visible')).toBeTruthy();
			$rootScope.someValue = 'something';
			$rootScope.$digest();
			expect(placeholder.is(':visible')).toBeFalsy();
		}));

		it('should show the placeholder when the input is empty', inject(function ($rootScope, $compile) {
			$rootScope.someValue = 'test';
			var element = angular.element('<input placeholder="foobar" ng-model="someValue" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			var placeholder = element.data('placeholder');
			$rootScope.$digest();
			expect(placeholder.is(':visible')).toBeFalsy();
			$rootScope.someValue = '';
			$rootScope.$digest();
			expect(placeholder.is(':visible')).toBeTruthy();
		}));

		it('should hide the placeholder when the input has focus', inject(function ($rootScope, $compile) {
			var element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			element.focus();
			var placeholder = element.data('placeholder');
			expect(placeholder.is(':visible')).toBeFalsy();
		}));

		it('should keep the element hidden after a digest cycle if it has focus', inject(function ($rootScope, $compile) {
			var element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			element.focus();
			$rootScope.$digest();
			var placeholder = element.data('placeholder');
			expect(placeholder.is(':visible')).toBeFalsy();
		}));
	});
});
