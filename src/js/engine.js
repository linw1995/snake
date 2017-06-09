'use strict'

function findIndex(xvalues, yvalues, x, y) {
  for (var index = 0; index < xvalues.length; index++) {
    if (xvalues[index] == x && yvalues[index] == y) {
      return index
    }
  }
  return -1
}

class Engine {
  constructor(width, height) {
    this.width = width
    this.height = height
    // ms
    this.snakeSpeed = 500
  }

  init() {
    const buffer = new ArrayBuffer(this.width * this.height)
    this._canvasData = new Uint8Array(buffer)
    this._i = new Array()
    this._j = new Array()
    this._ti = new Array()
    this._tj = new Array()
    this.produceTarget()
    // 0: right, 1: top, 2: left, 3: down
    this.snakeLength = 5
    this.lose = false
    this.newBody(Math.floor(this.height / 2), Math.floor(this.width / 2), 5)
    this.direction = 0
    this.predirection = 0
  }

  newBody(i, j, length) {
    while (length--) {
      this._i.push(i)
      this._j.push(j - length)
    }
  }

  index(i, j) {
    return i * this.width + j
  }

  cell(i, j) {
    return this._canvasData[this.index(i, j)]
  }

  set(i, j, value = 1) {
    let rv = this.cell(i, j)
    this._canvasData[this.index(i, j)] = value
    return rv
  }

  clear() {
    let size = this._canvasData.length
    while (size--) this._canvasData[size] = 0;
  }

  produceTarget() {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    let i = getRandomInt(0, this.height - 1)
    let j = getRandomInt(0, this.width - 1)
    this._ti.push(i)
    this._tj.push(j)
  }

  fillPath() {
    for (let index = 0; index < this._ti.length; index++) {
      let ti = this._ti[index]
      let tj = this._tj[index]
      for (let i = 0; i < this.height; i++)
        this.set(i, tj, 3)
      for (let j = 0; j < this.width; j++)
        this.set(ti, j, 3)
    }
  }

  comunicate(frameNumber, desiredFPS) {
    if (frameNumber % Math.floor(this.snakeSpeed / desiredFPS) == 0 && !this.lose)
      this.computeNextState()
  }

  computeNextState() {
    this.clear()
    let currenti = this._i[this._i.length - 1]
    let currentj = this._j[this._i.length - 1]
    switch (this.direction) {
      case 0:
        currentj++
        if (currentj > this.width - 1) currentj = 0
        break

      case 1:
        currenti--
        if (currenti < 0) currenti = this.height - 1
        break

      case 2:
        currentj--
        if (currentj < 0) currentj = this.width - 1
        break

      default:
        currenti++
        if (currenti > this.height - 1) currenti = 0
    }
    if (this.direction != this.predirection) this.predirection = this.direction

    this._i.push(currenti)
    this._j.push(currentj)

    while (this._i.length > this.snakeLength) {
      this._i.shift()
      this._j.shift()
    }

    this.fillPath()

    for (let i = 0; i < this._ti.length; i++) {
      this.set(this._ti[i], this._tj[i], 2)
    }

    for (let i = 0; i < this._i.length; i++) {
      let rpv = this.set(this._i[i], this._j[i], 1)
      if (rpv == 1)
        this.lose = true
      else if (rpv == 2) {
        this.snakeLength += 1
        let index = findIndex(this._ti, this._tj, this._i[i], this._j[i])
        this._ti.splice(index, 1)
        this._tj.splice(index, 1)
        this.produceTarget()
      }
    }
  }
}

export {
  Engine as
  default
}
