'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CANCEL = exports.UP = exports.MOVE = exports.DOWN = undefined;

var _tinyEmitter = require('tiny-emitter');

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