#!/usr/bin/env bash
set -e

DEBUG=false

run() {
  cd /home/volumio/NP-01_buttons
  {
    npm i --only=prod
  } || {
    sleep 10 && npm i --only=prod
  }
  node index.js
}

if [ "$DEBUG" = true ]; then
  run >>/home/volumio/NP-01_buttons/run.log 2>&1
else
  run
fi
