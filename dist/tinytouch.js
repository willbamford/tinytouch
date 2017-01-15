(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tinytouch"] = factory();
	else
		root["tinytouch"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var create = function create() {
	  var domElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;


	  var emitter = new Emitter();
	  var instance = {};
	  var listen = createListen(domElement);
	  var downEvent = null;

	  var on = function on(name, fn) {
	    emitter.on(name, fn);
	    return instance;
	  };
	  var once = function once(name, fn) {
	    emitter.once(name, fn);
	    return instance;
	  };
	  var off = function off(name, fn) {
	    emitter.off(name, fn);
	    return instance;
	  };

	  var createListen = function createListen(element) {
	    return function (name, cb) {
	      element.addEventListener(name, cb);
	    };
	  };

	  var createEventForMouse = function createEventForMouse(source) {
	    var x = source.offsetX;
	    var y = source.offsetY;

	    return {
	      source: source,
	      x: x,
	      y: y,
	      dx: downEvent ? x - downEvent.x : 0,
	      dy: downEvent ? y - downEvent.y : 0,
	      type: 'Mouse'
	    };
	  };

	  var createEventForTouch = function createEventForTouch(source) {
	    var bounds = source.target.getBoundingClientRect();
	    var touch = source.touches.length > 0 ? source.touches[0] : source.changedTouches[0];

	    var x = touch.clientX - bounds.left;
	    var y = touch.clientY - bounds.top;

	    return {
	      source: source,
	      x: x,
	      y: y,
	      dx: downEvent ? x - downEvent.x : 0,
	      dy: downEvent ? y - downEvent.y : 0,
	      type: 'Touch'
	    };
	  };

	  listen('mousedown', function (source) {
	    downEvent = createEventForMouse(source);
	    emitter.emit(DOWN, downEvent);
	  });

	  listen('touchstart', function (source) {
	    downEvent = createEventForTouch(source);
	    emitter.emit(DOWN, downEvent);
	  });

	  listen('mousemove', function (source) {
	    emitter.emit(MOVE, createEventForMouse(source));
	  });

	  listen('touchmove', function (source) {
	    emitter.emit(MOVE, createEventForTouch(source));
	  });

	  listen('mouseup', function (source) {
	    emitter.emit(UP, createEventForMouse(source));
	  });

	  listen('touchend', function (source) {
	    emitter.emit(UP, createEventForTouch(source));
	    downEvent = null;
	  });

	  listen('mouseout', function (source) {
	    emitter.emit(CANCEL, createEventForMouse(source));
	    downEvent = null;
	  });

	  listen('touchcancel', function (source) {
	    emitter.emit(CANCEL, createEventForTouch(source));
	    downEvent = null;
	  });

	  instance.on = on;
	  instance.once = once;
	  instance.off = off;

	  return instance;
	};

	exports.default = create;
	var DOWN = exports.DOWN = 'down';
	var MOVE = exports.MOVE = 'move';
	var UP = exports.UP = 'up';
	var CANCEL = exports.CANCEL = 'cancel';

/***/ }
/******/ ])
});
;