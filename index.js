'use strict'

const {execSync} = require('child_process')
const Gpio = require('onoff').Gpio

const APP_DIR = '/home/volumio/NP-01_home-button'
const GPIO_PIN = 24
const button = new Gpio(GPIO_PIN, 'in', 'rising', {debounceTimeout: 100})

button.watch((err) => {
  if (err) {
    throw err
  }
  try {
    execSync(`bash ${APP_DIR}/exit_vu_meter.sh >> ${APP_DIR}/home-button.log 2>&1`)
  } catch (e) {
    console.error(e.stdout.toString())
    console.error(e.stderr.toString())
  }
})

process.on('SIGINT', () => {
  button.unexport()
})
