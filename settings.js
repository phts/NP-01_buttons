'use strict'

const APP_DIR = '/home/volumio/NP-01_buttons'
const GPIO = {
  buttons: {
    play: 27,
    shutdown: 26,
    action: 24,
    previous: 22,
    next: 17,
  },
  leds: {
    play: 4,
  },
}

const BUTTONS = [
  {
    pin: GPIO.buttons.play,
    clickCmd: 'volumio toggle',
    holdCmd: {
      ifPlay: {
        cmd: `node ${APP_DIR}/commands/toggle-stop-after-current.js`,
        once: true,
        async: true,
      },
      ifPause: {cmd: `node ${APP_DIR}/commands/play-playlist.js`, once: true},
    },
  },
  {
    pin: GPIO.buttons.shutdown,
    clickCmd: 'systemctl poweroff',
    holdCmd: {cmd: 'systemctl restart volumio', once: true},
  },
  {
    pin: GPIO.buttons.action,
    clickCmd: `bash ${APP_DIR}/commands/exit_vu_meter.sh`,
    holdCmd: ['volumio repeat', 'volumio repeat', 'volumio repeat && volumio random'],
  },
  {pin: GPIO.buttons.previous, clickCmd: 'volumio previous', holdCmd: 'volumio seek minus'},
  {pin: GPIO.buttons.next, clickCmd: 'volumio next', holdCmd: 'volumio seek plus'},
]

module.exports = {
  BUTTONS,
  GPIO,
  REPEAT_DELAY: 750,
}
