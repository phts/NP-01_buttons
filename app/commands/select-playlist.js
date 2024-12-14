'use strict'
const fs = require('fs')
const path = require('path')
const socket = require('socket.io-client').connect(require('../settings').VOLUMIO_SOCKET_URL)

const DIRECTION = process.argv[2] || 'next'
const PLAYLIST_TXT = path.resolve(__dirname, 'selected-playlist.txt')
let currentPlaylist = null

function showMsgAndExit(...args) {
  socket.emit('pushToastMessage', ...args)
  setTimeout(() => {
    process.exit()
  }, 500)
}

try {
  currentPlaylist = fs.readFileSync(PLAYLIST_TXT).toString()
} catch (e) {
  currentPlaylist = 'NP-01'
}

socket.emit('listPlaylist', '')
socket.on('pushListPlaylist', (data) => {
  console.debug('pushListPlaylist', data)
  if (!data.length) {
    process.exit()
  }
  let ind = data.indexOf(currentPlaylist)
  if (ind === -1) {
    ind = 0
  } else {
    ind = DIRECTION === 'prev' ? ind - 1 : ind + 1
    ind = ind < 0 ? data.length - 1 : ind
    ind = ind % data.length
  }
  const selected = data[ind]
  fs.writeFileSync(PLAYLIST_TXT, selected)
  console.debug('Selected', selected)
  showMsgAndExit({type: 'info', title: selected})
})

setTimeout(() => {
  process.exit()
}, 60000)
