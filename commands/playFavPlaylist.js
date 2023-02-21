const {execSync} = require('child_process')
const socket = require('socket.io-client').connect('http://localhost:3000')
const PLAYLIST = 'NP-01'

function showProgressBar() {
  const bar = '####'
  socket.emit('pushToastMessage', {type: 'info', title: bar})

  let i = 2
  setInterval(() => {
    socket.emit('pushToastMessage', {type: 'info', title: bar.repeat(i)})
    i++
  }, 6000)
}

showProgressBar()
execSync('volumio stop')
execSync('volumio clear')
socket.emit('setRandom', {value: true})
socket.emit('setRepeat', {value: false})

const timeout = setTimeout(() => {
  process.exit()
}, 60000)

socket.emit('enqueue', {name: PLAYLIST})
socket.on('pushEnqueue', () => {
  console.info(`Added playlist "${PLAYLIST}" to queue`)
  execSync('volumio next')
  clearTimeout(timeout)
  process.exit()
})
