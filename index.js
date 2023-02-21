'use strict'

const {execSync} = require('child_process')
const Gpio = require('onoff').Gpio

const REPEAT_DELAY = 750
const APP_DIR = '/home/volumio/NP-01_buttons'
const BUTTONS = [
  {
    pin: 27,
    clickCmd: 'volumio toggle',
    holdCmd: [`node ${APP_DIR}/commands/playFavPlaylist.js`],
    holdOnce: true,
  },
  {
    pin: 26,
    clickCmd: 'systemctl poweroff',
    holdCmd: 'systemctl restart volumio',
    holdOnce: true,
  },
  {
    pin: 24,
    clickCmd: `bash ${APP_DIR}/commands/exit_vu_meter.sh`,
    holdCmd: ['volumio repeat', 'volumio repeat', 'volumio repeat && volumio random'],
  },
  {pin: 22, clickCmd: 'volumio previous', holdCmd: 'volumio seek minus'},
  {pin: 17, clickCmd: 'volumio next', holdCmd: 'volumio seek plus'},
]

let holdInterval
let holded = false
let pressed = false
let holdCmdIndex = 0

function exec(cmd) {
  console.debug(`exec(${cmd})`)
  try {
    const output = execSync(cmd)
    console.debug(output.toString())
  } catch (e) {
    console.error(e.stdout.toString())
    console.error(e.stderr.toString())
  }
}

const buttons = BUTTONS.map(({pin, clickCmd, holdCmd, holdOnce}) => {
  const btn = new Gpio(pin, 'in', holdCmd ? 'both' : 'rising', {debounceTimeout: 100})
  btn.watch((err, value) => {
    console.debug({pin, clickCmd, holdCmd, holdOnce, pressed, holded, value})
    if (err) {
      throw err
    }
    if (!holdCmd) {
      exec(clickCmd)
      return
    }
    if (value) {
      pressed = true
      holdCmdIndex = 0
      holdInterval = setInterval(() => {
        holded = true
        let cmd = holdCmd
        if (holdOnce) {
          clearInterval(holdInterval)
        }
        if (Array.isArray(holdCmd)) {
          cmd = holdCmd[holdCmdIndex]
          holdCmdIndex = (holdCmdIndex + 1) % holdCmd.length
        }
        exec(cmd)
      }, REPEAT_DELAY)
      return
    }
    clearInterval(holdInterval)
    if (pressed && !holded) {
      exec(clickCmd)
    }
    pressed = false
    holded = false
  })
  return btn
})

process.on('SIGINT', () => {
  console.debug('SIGINT')
  buttons.forEach((x) => x.unexport())
})
