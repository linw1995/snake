'use strict'

class EventHandler {
  constructor(canvas, engine, renderer) {
    this.canvas = canvas
    this.engine = engine
    this.renderer = renderer
    this.listeners = []

    this.addEvents([{
        eventType: 'keydown',
        callback: this.keyIsDown.bind(this)
      },
      {
        eventType: 'mousedown',
        callback: this.mouseIsDown.bind(this)
      },
      {
        eventType: 'touchmove',
        callback: event => {
          for (let i = 0; i < event.touches.length; i++) {
            this.mouseDirection(event.touches[i])
          }
        }
      }
    ])
  }

  addEvents(events = []) {
    events.forEach(event => {
      this.listeners.push(event)
      let target = document
      if (event.selector) {
        target = document.querySelector(event.selector)
      }
      target.addEventListener(event.eventType, event.callback)
    })
  }

  setDirection(key) {
    let predirection = this.engine.predirection
    switch (key) {
      case "ArrowRight":
        this.engine.direction = predirection === 2 ? 2 : 0
        break

      case "ArrowUp":
        this.engine.direction = predirection === 3 ? 3 : 1
        break

      case "ArrowLeft":
        this.engine.direction = predirection === 0 ? 0 : 2
        break

      case "ArrowDown":
        this.engine.direction = predirection === 1 ? 1 : 3
    }
  }

  keyIsDown(event) {
    this.setDirection(event.key)
  }

  mouseDirection(event) {
    const rect = this.canvas.getBoundingClientRect()
    const mousePosx = (event.clientX - rect.left) / (rect.right - rect.left) * this.canvas.clientWidth
    const mousePosy = (event.clientY - rect.top) / (rect.bottom - rect.top) * this.canvas.clientHeight
    const posi = ~~(mousePosy / this.renderer.pixelsPerCell)
    const posj = ~~(mousePosx / this.renderer.pixelsPerCell)
    const curi = this.engine._i[this.engine._i.length - 1]
    const curj = this.engine._j[this.engine._j.length - 1]
    const k = Math.sqrt(2) / 2
    const b1 = curj - curi * k
    const b2 = curj + curi * k
    const v1 = posj - (posi * k + b1)
    const v2 = posj - (- posi * k + b2)
    if (v1 >= 0 && v2 >= 0) {
      this.setDirection('ArrowRight')
    } else if (v1 >= 0 && v2 < 0) {
      this.setDirection('ArrowUp')
    } else if (v1 < 0 && v2 < 0) {
      this.setDirection('ArrowLeft')
    } else {
      this.setDirection('ArrowDown')
    }
  }

  mouseIsDown(event) {
    if (event.button === 0) {
      this.mouseDirection(event)
    }
  }
}

export {
  EventHandler as
  default
}
