'use strict'

const {readFileSync, readdirSync} = require('fs')
const {singleAction} = require('../helpers/volumioSocket')
const {readScreenMode} = require('../helpers/screenMode')

if (readScreenMode() !== 'idle') {
  return
}

const DIRECTION = process.argv[2] || 'next'
const config = JSON.parse(readFileSync('/data/configuration/user_interface/now_playing/config.json').toString())
const idleScreenConfig = JSON.parse(config.screen.idle.value)
const myBackgroundImage = idleScreenConfig.myBackgroundImage
const myBackgroundImages = readdirSync('/data/INTERNAL/NowPlayingPlugin/My Backgrounds/')
if (!myBackgroundImages.length) {
  return
}

const currentIndex = myBackgroundImages.findIndex((x) => x === myBackgroundImage)

let newIndex = 0
if (DIRECTION === 'next') {
  if (currentIndex >= 0) {
    newIndex = (currentIndex + 1) % myBackgroundImages.length
  }
} else {
  if (currentIndex > 0) {
    newIndex = currentIndex - 1
  } else if (currentIndex === 0) {
    newIndex = myBackgroundImages.length - 1
  }
}

singleAction((socket) => {
  socket.emit('callMethod', {
    endpoint: 'user_interface/now_playing',
    method: 'configSaveIdleScreenSettings',
    data: {myBackgroundImage: myBackgroundImages[newIndex]},
  })
})
