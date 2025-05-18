'use strict'

const io = require('socket.io-client')
const {VOLUMIO_SOCKET_URL} = require('../settings')

const socket = io.connect(VOLUMIO_SOCKET_URL)

module.exports = {
  socket,
  singleAction(cb) {
    cb(socket)
    setTimeout(() => {
      socket.disconnect()
    }, 500)
  },
}
