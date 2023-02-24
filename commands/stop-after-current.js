'use strict'
const socket = require('socket.io-client').connect('http://localhost:3000')

let currentTrack = null
let firstRun = true

function showMsg(type, message) {
  socket.emit('pushToastMessage', {type, title: 'Stop after current', message})
}

function showMsgAndExit(...args) {
  showMsg(...args)
  setTimeout(() => {
    process.exit()
  }, 500)
}

socket.emit('getState', '')
socket.on('pushState', ({status, service, uri}) => {
  console.debug({status, service, uri})
  if (status !== 'play') {
    if (firstRun) {
      showMsgAndExit('error', 'Already stopped')
    } else {
      showMsgAndExit('info', 'Off')
    }
    return
  }
  if (service === 'webradio') {
    if (firstRun) {
      showMsgAndExit('error', 'Not possible for web radio')
    } else {
      showMsgAndExit('info', 'Off')
    }
    return
  }
  if (firstRun) {
    showMsg('info', 'On')
  }
  if (!currentTrack) {
    currentTrack = uri
  }
  if (currentTrack !== uri) {
    // track changed
    socket.emit('pause', '')
    showMsgAndExit('success', 'Done')
    return
  }
  firstRun = false
})

process.on('SIGINT', () => {
  showMsgAndExit('info', 'Off')
})
process.on('SIGTERM', () => {
  showMsgAndExit('info', 'Off')
})
