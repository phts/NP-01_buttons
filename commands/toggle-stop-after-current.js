'use strict'
const {execSync} = require('child_process')

const FILENAME = '/stop-after-current.js'

const ids = execSync(`ps ax | grep "${FILENAME}"  | grep -v grep | awk '{print $1}'`)
  .toString()
  .split('\n')
  .filter((x) => x)

if (ids.length) {
  // already on
  ids.forEach((id) => {
    try {
      execSync(`kill ${id}`)
    } catch (e) {
      // ignore
    }
  })
  const socket = require('socket.io-client').connect('http://localhost:3000')
  socket.emit('pushToastMessage', {type: 'info', title: 'Stop after current', message: 'Off'})
  process.exit()
} else {
  // off
  try {
    const output = execSync(`node ${__dirname}/${FILENAME}`)
    console.debug(output.toString())
  } catch (e) {
    console.error(e.stderr ? e.stderr.toString() : e)
    console.error(e.stdout ? e.stdout.toString() : e)
  }
}
