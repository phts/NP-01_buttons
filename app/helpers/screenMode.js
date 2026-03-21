'use strict'

const fs = require('fs')
const path = require('path')

const SCREEN_TXT = path.resolve(__dirname, '..', 'commands', 'screen.txt')

module.exports = {
  readScreenMode() {
    try {
      return fs.readFileSync(SCREEN_TXT).toString() || 'track'
    } catch (e) {
      return 'track'
    }
  },
  writeScreenMode(mode) {
    fs.writeFileSync(SCREEN_TXT, mode)
  },
}
