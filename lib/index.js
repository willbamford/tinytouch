'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CANCEL = exports.UP = exports.DRAG = exports.MOVE = exports.DOWN = undefined;

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