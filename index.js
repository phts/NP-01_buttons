'use strict'

const {execSync: execSyncProc, exec: execProc} = require('child_process')
const Gpio = require('onoff').Gpio
const {BUTTONS, REPEAT_DELAY, GPIO} = require('./settings')

const playLed = new Gpio(GPIO.leds.play, 'out')

let holdInterval
let holded = false
let pressed = false
let holdCmdIndex = 0

function exec(cmd, opts = {}) {
  console.debug(`exec(${cmd})`)
  try {
    const output = opts.async
      ? execProc(cmd, (error, stdout, stderr) => {
          if (error) {
            console.debug(`exec error: ${error}`)
            return
          }
          console.debug(`stdout: ${stdout.toString()}`)
          console.debug(`stderr: ${stderr.toString()}`)
        })
      : execSyncProc(cmd, {timeout: opts.long ? 0 : 3000})
    console.debug(output.toString())
  } catch (e) {
    console.error(e.stdout.toString())
    console.error(e.stderr.toString())
  }
}

function explodeCmd(cmd, {playLed}) {
  if (cmd.ifPlay) {
    cmd = playLed.readSync() ? cmd.ifPlay : cmd.ifPause
  }
  if (Array.isArray(cmd) || typeof cmd === 'string') {
    cmd = {cmd}
  }
  return cmd
}

const buttons = BUTTONS.map(({pin, clickCmd, holdCmd}) => {
  const btn = new Gpio(pin, 'in', holdCmd ? 'both' : 'rising', {debounceTimeout: 10})
  btn.watch((err, value) => {
    console.debug({pin, clickCmd, holdCmd, pressed, holded, value})
    if (err) {
      throw err
    }
    if (!holdCmd) {
      exec(clickCmd)
      return
    }
    if (value) {
      pressed = true
      holdCmdIndex = -1
      clearInterval(holdInterval)
      holdInterval = setInterval(() => {
        holded = true
        const cmd = explodeCmd(holdCmd, {playLed})
        if (cmd.once) {
          clearInterval(holdInterval)
        }
        if (Array.isArray(cmd.cmd)) {
          holdCmdIndex = (holdCmdIndex + 1) % cmd.cmd.length
          cmd.cmd = cmd.cmd[holdCmdIndex]
        }
        exec(cmd.cmd, {async: cmd.async, long: cmd.long})
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
  process.exit()
})
