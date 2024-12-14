'use strict'

const socket = require('socket.io-client').connect(require('../settings').VOLUMIO_SOCKET_URL)

socket.emit('toggleStopAfterCurrent')
