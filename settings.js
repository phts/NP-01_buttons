'use strict'

const APP_DIR = __dirname
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
      ifPause: {
        cmd: `node ${APP_DIR}/commands/play-playlist.js "$(cat ${APP_DIR}/commands/selected-playlist.txt)"`,
        once: true,
        long: true,
      },
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
  {
    pin: GPIO.buttons.previous,
    clickCmd: 'volumio previous',
    holdCmd: {
      ifPlay: 'volumio seek minus',
      ifPause: {
        cmd: `node ${APP_DIR}/commands/select-playlist.js prev`,
        once: true,
      },
    },
  },
  {
    pin: GPIO.buttons.next,
    clickCmd: 'volumio next',
    holdCmd: {
      ifPlay: 'volumio seek plus',
      ifPause: {
        cmd: `node ${APP_DIR}/commands/select-playlist.js next`,
        once: true,
      },
    },
  },
]

module.exports = {
  BUTTONS,
  GPIO,
  REPEAT_DELAY: 750,
}
