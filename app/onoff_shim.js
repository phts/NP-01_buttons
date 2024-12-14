'use strict'

const {
  watch_gpio,
  deinit_gpio,
  GPIO_MODE_OUTPUT,
  GPIO_MODE_INPUT_PULLDOWN,
  GPIO_EDGE_RISING,
  GPIO_EDGE_FALLING,
  GPIO_EDGE_BOTH,
} = require('@iiot2k/gpiox')

const GPIOX_EDGE = {
  rising: GPIO_EDGE_RISING,
  falling: GPIO_EDGE_FALLING,
  both: GPIO_EDGE_BOTH,
}
const GPIOX_DIRECTION = {
  out: GPIO_MODE_OUTPUT,
  in: GPIO_MODE_INPUT_PULLDOWN,
}

class Gpio {
  constructor(pin, direction, edge, options = {}) {
    this.pin = pin
    this.options = options
    this.edge = GPIOX_EDGE[edge] || GPIO_EDGE_RISING
    this.direction = GPIOX_DIRECTION[direction] || GPIO_MODE_OUTPUT
    this.debounceTimeout = (this.options.debounceTimeout || 0) * 1000
  }

  watch(callback) {
    watch_gpio(this.pin, this.direction, this.debounceTimeout, this.edge, (state) => {
      callback(null, state)
    })
  }

  unexport() {
    deinit_gpio(this.pin)
  }
}

module.exports = {Gpio}
