angular-spinner
===============

Angular directive to make the input/textarea placeholder attribute work on all browsers.
Uses the [jquery-html5-placeholder-shim](JQuery HTML5 Placeholder Shim Plugin).

Copyright (C) 2013, Uri Shaked <uri@urish.org>.

[![Build Status](https://travis-ci.org/urish/angular-placeholder-shim.png?branch=master)](https://travis-ci.org/urish/angular-placeholder-shim)

Usage
-----
Include both jquery.html5-placeholder-shim.js and angular-placeholder-shim.js in your application. You will also
need to have jQuery in your project.

```html
<script src="components/jquery-html5-placeholder-shim/jquery.html5-placeholder-shim.js"></script>
<script src="components/angular-placeholder-shim/angular-placeholder-shim.js"></script>
```

Add the module `placeholderShim` as a dependency to your app module:

```js
var myapp = angular.module('myapp', ['placeholderShim']);
```

That's all. Now your will be able to see your placeholders even on IE9.
```html
<input type="text" name="email" placeholder="Enter your email" />
```

License
----

Released under the terms of MIT License.
