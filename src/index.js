import Emitter from 'tiny-emitter'

const createListen = (element) => {
  return (name, cb) => {
    element.addEventListener(name, cb)
  }
}

const create = (domElement = window) => {
  const emitter = new Emitter()
  const instance = {}
  const listen = createListen(domElement)
  let downEvent = null
  let moveEvent = null

  const on = (name, fn) => {
    emitter.on(name, fn)
    return instance
  }

  const once = (name, fn) => {
    emitter.once(name, fn)
    return instance
  }

  const off = (name, fn) => {
    emitter.off(name, fn)
    return instance
  }

  const isDown = () => !!downEvent

  const createEvent = (source, x, y, type) => {
    const prevEvent = (moveEvent || downEvent)
    return {
      source,
      x,
      y,
      dx: prevEvent ? x - prevEvent.x : 0,
      dy: prevEvent ? y - prevEvent.y : 0,
      tx: downEvent ? x - downEvent.x : 0,
      ty: downEvent ? y - downEvent.y : 0,
      type
    }
  }

  const createEventForMouse = (source) => {
    const target = source.target || source.srcElement
    const bounds = target.getBoundingClientRect()
    const x = source.clientX - bounds.left
    const y = source.clientY - bounds.top
    return createEvent(source, x, y, 'Mouse')
  }

  const createEventForTouch = (source) => {
    const bounds = source.target.getBoundingClientRect()
    const touch = source.touches.length > 0 ? source.touches[0] : source.changedTouches[0]
    const x = touch.clientX - bounds.left
    const y = touch.clientY - bounds.top
    return createEvent(source, x, y, 'Touch')
  }

  const handleDown = (event) => {
    downEvent = event
    emitter.emit(DOWN, event)
  }

  const handleMove = (event) => {
    moveEvent = event
    emitter.emit(MOVE, event)
    if (isDown()) {
      emitter.emit(DRAG, event)
    }
  }

  const handleUp = (event) => {
    emitter.emit(UP, event)
    downEvent = null
    moveEvent = null
  }

  const handleCancel = (event) => {
    emitter.emit(CANCEL, event)
    downEvent = null
    moveEvent = null
  }

  listen('mousedown', source => handleDown(createEventForMouse(source)))
  listen('touchstart', source => handleDown(createEventForTouch(source)))

  listen('mousemove', source => handleMove(createEventForMouse(source)))
  listen('touchmove', source => handleMove(createEventForTouch(source)))

  listen('mouseup', source => handleUp(createEventForMouse(source)))
  listen('touchend', source => handleUp(createEventForTouch(source)))

  listen('mouseout', source => handleCancel(createEventForMouse(source)))
  listen('touchcancel', source => handleCancel(createEventForTouch(source)))

  instance.on = on
  instance.once = once
  instance.off = off

  return instance
}

export default create

export const DOWN = 'down'
export const MOVE = 'move'
export const DRAG = 'drag'
export const UP = 'up'
export const CANCEL = 'cancel'
