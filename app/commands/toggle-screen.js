'use strict'
const {exec} = require('child_process')
const path = require('path')
const {readScreenMode} = require('../helpers/screenMode')

const setScreenCmd = (type) => ['node', path.resolve(__dirname, 'set-screen.js'), type].join(' ')

const order = ['track', 'vu', 'idle']
let pos = order.indexOf(readScreenMode())
if (pos === -1) {
  pos = 0
}

pos = (pos + 1) % order.length

exec(setScreenCmd(order[pos]))
