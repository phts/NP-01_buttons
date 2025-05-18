'use strict'
const {exec} = require('child_process')
const fs = require('fs')
const path = require('path')

const setScreenCmd = (type) => ['node', path.resolve(__dirname, 'set-screen.js'), type].join(' ')

const SCREEN_TXT = path.resolve(__dirname, 'screen.txt')
const order = ['track', 'vu', 'idle']
let pos = -1

try {
  pos = order.indexOf(fs.readFileSync(SCREEN_TXT).toString())
} catch (e) {
  // ignore
}
if (pos === -1) {
  pos = 0
}

pos = (pos + 1) % order.length

exec(setScreenCmd(order[pos]))
