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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CANCEL = exports.UP = exports.DRAG = exports.MOVE = exports.DOWN = undefined;

	var _tinyEmitter = __webpack_require__(1);

	var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var createListen = function createListen(element) {
	  return function (name, cb) {
	    element.addEventListener(name, cb);
	  };
	};

	var create = function create() {
	  var domElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

	  var emitter = new _tinyEmitter2.default();
	  var instance = {};
	  var listen = createListen(domElement);
	  var downEvent = null;
	  var moveEvent = null;

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

	  var isDown = function isDown() {
	    return !!downEvent;
	  };

	  var createEvent = function createEvent(source, x, y, type) {
	    var prevEvent = moveEvent || downEvent;
	    return {
	      source: source,
	      x: x,
	      y: y,
	      dx: prevEvent ? x - prevEvent.x : 0,
	      dy: prevEvent ? y - prevEvent.y : 0,
	      tx: downEvent ? x - downEvent.x : 0,
	      ty: downEvent ? y - downEvent.y : 0,
	      type: type
	    };
	  };

	  var createEventForMouse = function createEventForMouse(source) {
	    var target = source.target || source.srcElement;
	    var bounds = target.getBoundingClientRect();
	    var x = source.clientX - bounds.left;
	    var y = source.clientY - bounds.top;
	    return createEvent(source, x, y, 'Mouse');
	  };

	  var createEventForTouch = function createEventForTouch(source) {
	    var bounds = source.target.getBoundingClientRect();
	    var touch = source.touches.length > 0 ? source.touches[0] : source.changedTouches[0];
	    var x = touch.clientX - bounds.left;
	    var y = touch.clientY - bounds.top;
	    return createEvent(source, x, y, 'Touch');
	  };

	  var handleDown = function handleDown(event) {
	    downEvent = event;
	    emitter.emit(DOWN, event);
	  };

	  var handleMove = function handleMove(event) {
	    moveEvent = event;
	    emitter.emit(MOVE, event);
	    if (isDown()) {
	      emitter.emit(DRAG, event);
	    }
	  };

	  var handleUp = function handleUp(event) {
	    emitter.emit(UP, event);
	    downEvent = null;
	    moveEvent = null;
	  };

	  var handleCancel = function handleCancel(event) {
	    emitter.emit(CANCEL, event);
	    downEvent = null;
	    moveEvent = null;
	  };

	  listen('mousedown', function (source) {
	    return handleDown(createEventForMouse(source));
	  });
	  listen('touchstart', function (source) {
	    return handleDown(createEventForTouch(source));
	  });

	  listen('mousemove', function (source) {
	    return handleMove(createEventForMouse(source));
	  });
	  listen('touchmove', function (source) {
	    return handleMove(createEventForTouch(source));
	  });

	  listen('mouseup', function (source) {
	    return handleUp(createEventForMouse(source));
	  });
	  listen('touchend', function (source) {
	    return handleUp(createEventForTouch(source));
	  });

	  listen('mouseout', function (source) {
	    return handleCancel(createEventForMouse(source));
	  });
	  listen('touchcancel', function (source) {
	    return handleCancel(createEventForTouch(source));
	  });

	  instance.on = on;
	  instance.once = once;
	  instance.off = off;

	  return instance;
	};

	exports.default = create;
	var DOWN = exports.DOWN = 'down';
	var MOVE = exports.MOVE = 'move';
	var DRAG = exports.DRAG = 'drag';
	var UP = exports.UP = 'up';
	var CANCEL = exports.CANCEL = 'cancel';

/***/ },
/* 1 */
/***/ function(module, exports) {

	function E () {
	  // Keep this empty so it's easier to inherit from
	  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
	}

	E.prototype = {
	  on: function (name, callback, ctx) {
	    var e = this.e || (this.e = {});

	    (e[name] || (e[name] = [])).push({
	      fn: callback,
	      ctx: ctx
	    });

	    return this;
	  },

	  once: function (name, callback, ctx) {
	    var self = this;
	    function listener () {
	      self.off(name, listener);
	      callback.apply(ctx, arguments);
	    };

	    listener._ = callback
	    return this.on(name, listener, ctx);
	  },

	  emit: function (name) {
	    var data = [].slice.call(arguments, 1);
	    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
	    var i = 0;
	    var len = evtArr.length;

	    for (i; i < len; i++) {
	      evtArr[i].fn.apply(evtArr[i].ctx, data);
	    }

	    return this;
	  },

	  off: function (name, callback) {
	    var e = this.e || (this.e = {});
	    var evts = e[name];
	    var liveEvents = [];

	    if (evts && callback) {
	      for (var i = 0, len = evts.length; i < len; i++) {
	        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
	          liveEvents.push(evts[i]);
	      }
	    }

	    // Remove event from queue to prevent memory leak
	    // Suggested by https://github.com/lazd
	    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

	    (liveEvents.length)
	      ? e[name] = liveEvents
	      : delete e[name];

	    return this;
	  }
	};

	module.exports = E;


/***/ }
/******/ ])
});
;