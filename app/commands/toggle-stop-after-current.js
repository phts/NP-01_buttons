'use strict'

const socket = require('socket.io-client').connect('http://localhost:3000')

socket.emit('toggleStopAfterCurrent')
