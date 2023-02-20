'use strict'

const {execSync} = require('child_process')
const Gpio = require('onoff').Gpio

const REPEAT_DELAY = 750
const APP_DIR = '/home/volumio/NP-01_buttons'
const HOME_BTN_GPIO_PIN = 24
const PREV_BTN_GPIO_PIN = 22
const NEXT_BTN_GPIO_PIN = 17
const homeButton = new Gpio(HOME_BTN_GPIO_PIN, 'in', 'rising', {debounceTimeout: 100})
const prevButton = new Gpio(PREV_BTN_GPIO_PIN, 'in', 'both', {debounceTimeout: 100})
const nextButton = new Gpio(NEXT_BTN_GPIO_PIN, 'in', 'both', {debounceTimeout: 100})
let holdInterval
let holded = false

function exec(cmd) {
  try {
    execSync(`${cmd} >> ${APP_DIR}/buttons.log 2>&1`)
  } catch (e) {
    console.error(e.stdout.toString())
    console.error(e.stderr.toString())
  }
}

homeButton.watch((err) => {
  if (err) {
    throw err
  }
  exec(`bash ${APP_DIR}/exit_vu_meter.sh`)
})
;[
  [prevButton, 'volumio seek minus', 'volumio previous'],
  [nextButton, 'volumio seek plus', 'volumio next'],
].forEach(([btn, holdCmd, clickCmd]) => {
  btn.watch((err, pressed) => {
    if (err) {
      throw err
    }
    if (pressed) {
      holdInterval = setInterval(() => {
        holded = true
        exec(holdCmd)
      }, REPEAT_DELAY)
      return
    }
    clearInterval(holdInterval)
    if (!holded) {
      exec(clickCmd)
    }
    holded = false
  })
})

process.on('SIGINT', () => {
  homeButton.unexport()
  prevButton.unexport()
  nextButton.unexport()
})
