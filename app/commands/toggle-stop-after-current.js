'use strict'

const {singleAction} = require('../helpers/volumioSocket')

singleAction((socket) => {
  socket.emit('toggleStopAfterCurrent')
})
