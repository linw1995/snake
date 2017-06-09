'use strict'

class Renderer {
  constructor(canvas, engine, options = {}) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
    this.engine = engine

    // options
    this.pixelsPerCell = options.pixelsPerCell || 5
    this.desiredFPS = options.desiredFPS || 30
    this.fpsNode = options.fpsNode || false
    this.strokeStyle = options.strokeStyle || {
      1: 'rgba(255, 118, 5, 0.5)',
      2: 'rgba(22, 45, 122, 0.5)',
      3: 'rgba(42, 85, 244, 0.5)'
    }
    this.fillStyle = options.fillStyle || {
      1: 'rgba(222, 122, 39 , 0.5)',
      2: 'rgba(200, 200, 230, 0.5)',
      3: 'rgba(230, 239, 254, 0.5)'
    }

    // renderer variables
    this.play = false
    this.fpsTime = 0
    this.engineTime = 0
    this.fps = 0
    this.frameNumber = 0

    // setup canvas with correct size
    this.canvas.width = this.engine.width * this.pixelsPerCell
    this.canvas.height = this.engine.height * this.pixelsPerCell
  }

  togglePlay() {
    this.play = !this.play
  }

  draw(timeStamp) {
    window.requestAnimationFrame(this.draw.bind(this))

    // display engine state on each frame
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.context.fillStyle = '#f1f8ff'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < this.engine.height; i++) {
      for (let j = 0; j < this.engine.width; j++) {
        if (this.engine.cell(i, j)) {
          this.context.strokeStyle = this.strokeStyle[this.engine.cell(i, j)]
          this.context.fillStyle = this.fillStyle[this.engine.cell(i, j)]
          this.context.strokeRect(
            this.pixelsPerCell * j, this.pixelsPerCell * i,
            this.pixelsPerCell, this.pixelsPerCell
          )
          if (this.pixelsPerCell > 1) {
            this.context.fillRect(
              this.pixelsPerCell * j, this.pixelsPerCell * i,
              this.pixelsPerCell, this.pixelsPerCell
            )
          }
        }
      }
    }

    // compute engine next step with appropriate frequency
    const engineElapsed = timeStamp - this.engineTime
    if (engineElapsed > 1000 / this.desiredFPS && this.play) {
      this.engine.comunicate(this.frameNumber, this.desiredFPS)
      this.frameNumber += 1
      this.engineTime = timeStamp - (engineElapsed % (1000 / this.desiredFPS))
    }

    // Update FPS display every half second
    if (this.fpsNode) {
      const fpsElapsed = timeStamp - this.fpsTime
      if (fpsElapsed > 500) {
        this.fps = 1000 / fpsElapsed * this.frameNumber
        this.fpsNode.textContent = `${this.fps.toFixed(2)} FPS`
        this.fpsTime = timeStamp
        this.frameNumber = 0
      }
    }

    if (this.engine.lose) {
      this.context.font = "100px Arial"
      this.context.fillStyle = this.fillStyle[1]
      this.context.strokeStyle = this.strokeStyle[1]
      this.context.textAlign = "center"
      this.context.fillText("You Lost", this.canvas.width / 2, this.canvas.height / 2)
      this.context.strokeText("You Lost", this.canvas.width / 2, this.canvas.height / 2)
    }
  }

  start() {
    this.engine.computeNextState()
    this.play = true
    window.requestAnimationFrame(this.draw.bind(this))
  }
}

export {
  Renderer as
  default
}
