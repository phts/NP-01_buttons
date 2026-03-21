'use strict'

const APP_DIR = __dirname
const SHOW_TRACK_SCREEN_CMD = `node ${APP_DIR}/commands/set-screen.js track`
const TOGGLE_SCREEN_CMD = `node ${APP_DIR}/commands/toggle-screen.js`
const GPIO = {
  buttons: {
    play: 27,
    shutdown: 26,
    action: 24,
    previous: 22,
    next: 17,
  },
  leds: {
    play: 12,
  },
}

const BUTTONS = [
  {
    pin: GPIO.buttons.play,
    clickCmd: 'volumio toggle',
    holdCmd: {
      ifPlay: {
        cmd: `${SHOW_TRACK_SCREEN_CMD}; node ${APP_DIR}/commands/toggle-stop-after-current.js`,
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
    holdCmd: {cmd: 'systemctl reboot', once: true},
  },
  {
    pin: GPIO.buttons.action,
    clickCmd: TOGGLE_SCREEN_CMD,
    holdCmd: {
      delay: 2500,
      ifScreen: {
        track: [`${SHOW_TRACK_SCREEN_CMD}; volumio repeat`, 'volumio repeat', 'volumio repeat && volumio random'],
        vu: [`${SHOW_TRACK_SCREEN_CMD}; volumio repeat`, 'volumio repeat', 'volumio repeat && volumio random'],
        idle: `node ${APP_DIR}/commands/idle-screen-image.js next`,
      },
    },
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
  VOLUMIO_SOCKET_URL: 'http://localhost:3000',
}
