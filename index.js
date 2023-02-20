'use strict'

const {execSync} = require('child_process')
const Gpio = require('onoff').Gpio

const REPEAT_DELAY = 750
const APP_DIR = '/home/volumio/NP-01_buttons'
const BUTTONS = [
  {pin: 24, clickCmd: `bash ${APP_DIR}/exit_vu_meter.sh`},
  {pin: 22, clickCmd: 'volumio previous', holdCmd: 'volumio seek minus'},
  {pin: 17, clickCmd: 'volumio next', holdCmd: 'volumio seek plus'},
]

let holdInterval
let holded = false

function exec(cmd) {
  try {
    execSync(cmd)
  } catch (e) {
    console.error(e.stdout.toString())
    console.error(e.stderr.toString())
  }
}

const buttons = BUTTONS.map(({pin, clickCmd, holdCmd}) => {
  const btn = new Gpio(pin, 'in', holdCmd ? 'both' : 'rising', {debounceTimeout: 100})
  btn.watch((err, pressed) => {
    if (err) {
      throw err
    }
    if (!holdCmd) {
      exec(clickCmd)
      return
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
  return btn
})

process.on('SIGINT', () => {
  buttons.forEach((x) => x.unexport())
})
