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

  const createEventForMouse = (source) => {
    const x = source.offsetX
    const y = source.offsetY

    return {
      source,
      x,
      y,
      dx: downEvent ? x - downEvent.x : 0,
      dy: downEvent ? y - downEvent.y : 0,
      type: 'Mouse'
    }
  }

  const createEventForTouch = (source) => {
    const bounds = source.target.getBoundingClientRect()
    const touch = source.touches.length > 0 ? source.touches[0] : source.changedTouches[0]

    const x = touch.clientX - bounds.left
    const y = touch.clientY - bounds.top

    return {
      source,
      x,
      y,
      dx: downEvent ? x - downEvent.x : 0,
      dy: downEvent ? y - downEvent.y : 0,
      type: 'Touch'
    }
  }

  listen('mousedown', source => {
    downEvent = createEventForMouse(source)
    emitter.emit(DOWN, downEvent)
  })

  listen('touchstart', source => {
    downEvent = createEventForTouch(source)
    emitter.emit(DOWN, downEvent)
  })

  listen('mousemove', source => {
    emitter.emit(MOVE, createEventForMouse(source))
  })

  listen('touchmove', source => {
    emitter.emit(MOVE, createEventForTouch(source))
  })

  listen('mouseup', source => {
    emitter.emit(UP, createEventForMouse(source))
  })

  listen('touchend', source => {
    emitter.emit(UP, createEventForTouch(source))
    downEvent = null
  })

  listen('mouseout', source => {
    emitter.emit(CANCEL, createEventForMouse(source))
    downEvent = null
  })

  listen('touchcancel', source => {
    emitter.emit(CANCEL, createEventForTouch(source))
    downEvent = null
  })

  instance.on = on
  instance.once = once
  instance.off = off

  return instance
}

export default create

export const DOWN = 'down'
export const MOVE = 'move'
export const UP = 'up'
export const CANCEL = 'cancel'
