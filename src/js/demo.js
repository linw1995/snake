'use strict'

import Engine from './engine'
import Renderer from './renderer'
import EventHandler from './events'
import queryString from 'query-string'

const defaultOptions = {
  canvasSelector: '#universe',
  fpsNodeSelector: '#fps-info',
  playButtonSelector: '#ctrl-play-pause',
  restartButtonSelector: "#ctrl-restart",
  desiredFPS: 60,
  snakeSpeed: 500,
  pixelsPerCell: 45,
  strokeStyle: {
    1: 'rgba(255, 118, 5, 0.5)',
    2: 'rgba(0, 0, 0, 0.5)',
    3: 'rgba(42, 85, 244, 0.5)'
  },
  fillStyle: {
    1: 'rgba(222, 122, 39 , 0.5)',
    2: 'rgba(0, 0, 0, 0.5)',
    3: 'rgba(230, 239, 254, 0.5)'
  }
}
const urlOptions = queryString.parse(window.location.search)
const options = Object.assign(defaultOptions, urlOptions)
options.desiredFPS = parseInt(options.desiredFPS, 10)
options.pixelsperCell = parseInt(options.pixelsperCell, 10)
options.snakeSpeed = parseInt(options.snakeSpeed, 10)

function Snake() {
  const canvas = document.querySelector(options.canvasSelector)

  const width = ~~(canvas.clientWidth / options.pixelsPerCell)
  const height = ~~(canvas.clientHeight / options.pixelsPerCell)
  const engine = new Engine(width, height)

  window.engine = engine

  engine.snakeSpeed = options.snakeSpeed

  const renderer = new Renderer(canvas, engine, {
    desiredFPS: options.desiredFPS,
    pixelsPerCell: options.pixelsPerCell,
    fpsNode: document.querySelector(options.fpsNodeSelector),
    strokeStyle: options.strokeStyle,
    fillStyle: options.fillStyle
  })

  const playPauseToggle = event => {
    renderer.togglePlay()
    event.target.textContent = event.target.textContent === 'Pause' ? 'Play' : 'Pause'
  }

  function begin() {
    engine.init()
    renderer.start()
  }
  const restart = event => {
    begin()
  }
  const events = new EventHandler(canvas, engine, renderer)
  events.addEvents([{
      selector: options.playButtonSelector,
      eventType: 'click',
      callback: playPauseToggle
    },
    {
      selector: options.restartButtonSelector,
      eventType: 'click',
      callback: restart
    }
  ])
  begin()
}

window.onload = Snake
