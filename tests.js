/* License: MIT.
 * Copyright (C) 2013, Uri Shaked.
 */

'use strict';

describe('Directive: placeholder', function () {
	var originalPlaceholderBrowserSupported = jQuery.placeholder.browser_supported;
	var originalPlaceholderShim = jQuery.fn._placeholder_shim;
	var element;
	var $timeout;

	beforeEach(module(function($provide) {
		element = null;
		spyOn(jQuery.fn, '_placeholder_shim').andCallThrough();
	}));

	beforeEach(module('placeholderShim'));

	beforeEach(inject(function ($injector) {
		$timeout = $injector.get('$timeout');
	}));

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

		var $rootScope, $compile;

		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$compile = $injector.get('$compile');
		}));

		it('should call the placeholder-shim plugin, but only after a timeout', function () {
			element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			expect(jQuery.fn._placeholder_shim).not.toHaveBeenCalled();
			$timeout.flush();
			expect(jQuery.fn._placeholder_shim).toHaveBeenCalled();
		});

		it('should not call the placeholder-shim plugin until the element becomes visible', function() {
			element = angular.element('<input placeholder="foobar" />');
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			$timeout.verifyNoPendingTasks();
			expect(jQuery.fn._placeholder_shim).not.toHaveBeenCalled();
			angular.element('body').append(element);
			$rootScope.$digest();
			$timeout.flush();
			expect(jQuery.fn._placeholder_shim).toHaveBeenCalled();
		});

		it('should create an overlay for the placeholder', function () {
			var element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			$timeout.flush();
			expect(element.data('placeholder')).toBeDefined();
		});

		it('should call the shim when the element first becomes visible', function() {
			var element = angular.element('<input placeholder="foobar" />');
			element = $compile(element)($rootScope);
			$timeout.verifyNoPendingTasks();
			expect(jQuery.fn._placeholder_shim).not.toHaveBeenCalled();
			angular.element('body').append(element);
			$rootScope.$digest();
			$timeout.flush();
			expect(jQuery.fn._placeholder_shim).toHaveBeenCalled();
		});

		it('should hide the placeholder when the input gets a value', function () {
			$rootScope.someValue = '';
			var element = angular.element('<input placeholder="foobar" ng-model="someValue" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			$timeout.flush();
			var placeholder = element.data('placeholder');
			expect(placeholder.is(':visible')).toBeTruthy();
			$rootScope.someValue = 'something';
			$rootScope.$digest();
			expect(placeholder.is(':visible')).toBeFalsy();
		});

		it('should show the placeholder when the input is empty', function () {
			$rootScope.someValue = 'test';
			var element = angular.element('<input placeholder="foobar" ng-model="someValue" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			$timeout.flush();
			var placeholder = element.data('placeholder');
			expect(placeholder.is(':visible')).toBeFalsy();
			$rootScope.someValue = '';
			$rootScope.$digest();
			expect(placeholder.is(':visible')).toBeTruthy();
		});

		it('should hide the placeholder when the input has focus', function () {
			var element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			$timeout.flush();
			element.focus();
			var placeholder = element.data('placeholder');
			expect(placeholder.is(':visible')).toBeFalsy();
		});

		it('should keep the element hidden after a digest cycle if it has focus', function () {
			var element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			$timeout.flush();
			element.focus();
			$rootScope.$digest();
			var placeholder = element.data('placeholder');
			expect(placeholder.is(':visible')).toBeFalsy();
		});

		it('should support angular expressions in the placeholder attribute', function() {
			$rootScope.myVar = 7;
			var element = angular.element('<input placeholder="{{myVar + 5}}" />');
			angular.element('body').append(element);
			element = $compile(element)($rootScope);
			$rootScope.$digest();
			$timeout.flush();
			expect(element.data('placeholder').text()).toBe('12');
			$rootScope.myVar = 37;
			$rootScope.$digest();
			expect(element.data('placeholder').text()).toBe('42');
		});

		it('should cancel the overlay creation timeout on scope destroy', function () {
			var scope = $rootScope.$new();
			var element = angular.element('<input placeholder="foobar" />');
			angular.element('body').append(element);
			element = $compile(element)(scope);
			$rootScope.$digest();
			scope.$destroy();
			$timeout.verifyNoPendingTasks();
			expect(element.data('placeholder')).toBeUndefined();
		});

		it('should gracefully handle the situation when the scope was destroyed before the element was added to DOM', function () {
			var scope = $rootScope.$new();
			var element = angular.element('<input placeholder="foobar" />');
			element = $compile(element)(scope);
			$rootScope.$digest();
			scope.$destroy();
			$timeout.verifyNoPendingTasks();
		});
	});
});
