'use strict'

const {execSync: execSyncProc, exec: execProc} = require('child_process')
const io = require('socket.io-client')
const Gpio = require('./onoff_shim').Gpio
const {BUTTONS, REPEAT_DELAY, VOLUMIO_SOCKET_URL} = require('./settings')

const socket = io.connect(VOLUMIO_SOCKET_URL)

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
    console.error(e.stderr ? e.stderr.toString() : e)
    console.error(e.stdout ? e.stdout.toString() : e)
  }
}

function normalizeCmd(cmd) {
  if (Array.isArray(cmd) || typeof cmd === 'string') {
    return {cmd}
  }
  return cmd
}

function explodeCmd(cmd) {
  if (cmd.ifPlay) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('Failed to receive `pushState` event from Volumio')
      }, 5000)
      socket.emit('getState')
      socket.once('pushState', (state) => {
        clearTimeout(timeout)
        resolve(normalizeCmd(state.status === 'play' ? cmd.ifPlay : cmd.ifPause))
      })
    })
  }
  return Promise.resolve(normalizeCmd(cmd))
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
      holdInterval = setInterval(async () => {
        holded = true
        const cmd = await explodeCmd(holdCmd)
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
