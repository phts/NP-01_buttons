const APP_DIR = '/home/volumio/NP-01_buttons'
const GPIO = {
  buttons: {
    play: 27,
    shutdown: 26,
    action: 24,
    previous: 22,
    next: 17,
  },
}

const BUTTONS = [
  {
    pin: GPIO.buttons.play,
    clickCmd: 'volumio toggle',
    holdCmd: [`node ${APP_DIR}/commands/play-playlist.js`],
    holdOnce: true,
  },
  {
    pin: GPIO.buttons.shutdown,
    clickCmd: 'systemctl poweroff',
    holdCmd: 'systemctl restart volumio',
    holdOnce: true,
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
  REPEAT_DELAY: 750,
}
