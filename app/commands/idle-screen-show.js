'use strict'

const {singleAction} = require('../helpers/volumioSocket')

singleAction((socket) => {
  socket.emit('callMethod', {
    endpoint: 'user_interface/now_playing',
    method: 'manuallyShowIdleScreen',
    data: {visible: true},
  })
})
