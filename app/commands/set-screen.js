'use strict'

const {exec} = require('child_process')
const fs = require('fs')
const path = require('path')

const SCREEN_TXT = path.resolve(__dirname, 'screen.txt')

const VU_METER_HIDE_CMD = `bash ${__dirname}/vu_meter_hide.sh || true`
const VU_METER_SHOW_CMD = `bash ${__dirname}/vu_meter_show.sh || true`
const IDLE_SCREEN_HIDE_CMD = `node ${__dirname}/idle-screen-hide.js || true`
const IDLE_SCREEN_SHOW_CMD = `node ${__dirname}/idle-screen-show.js || true`

const screenType = process.argv[2]

switch (screenType) {
  case 'track':
    exec([VU_METER_HIDE_CMD, IDLE_SCREEN_HIDE_CMD].join(';'))
    break
  case 'vu':
    exec([VU_METER_SHOW_CMD, IDLE_SCREEN_HIDE_CMD].join(';'))
    break
  case 'idle':
    exec([IDLE_SCREEN_SHOW_CMD, VU_METER_HIDE_CMD].join(';'))
    break
  default:
    console.error(`toggle-screen.js: unsupported value: ${screenType}`)
    process.exit(1)
}

fs.writeFileSync(SCREEN_TXT, screenType)
