'use strict'
const {execSync} = require('child_process')
const socket = require('socket.io-client').connect('http://localhost:3000')

const PLAYLIST = process.argv[2] || 'NP-01'

function showProgressBar() {
  const bar = '####'
  socket.emit('pushToastMessage', {type: 'info', title: PLAYLIST, message: bar})

  let i = 2
  setInterval(() => {
    socket.emit('pushToastMessage', {type: 'info', title: PLAYLIST, message: bar.repeat(i)})
    i++
  }, 6000)
}

showProgressBar()
execSync('volumio clear')

const timeout = setTimeout(() => {
  process.exit()
}, 60000)

socket.emit('enqueue', {name: PLAYLIST})
socket.on('pushEnqueue', (data) => {
  console.info(`Added playlist "${PLAYLIST}" with ${data.amount} items to queue`)
  socket.emit('setRandom', {value: true})
  socket.emit('setRepeat', {value: false})
  setTimeout(() => {
    socket.emit('play', {value: Math.floor(Math.random() * data.amount)})
    clearTimeout(timeout)
    process.exit()
  }, 500)
})
