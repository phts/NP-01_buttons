#!/usr/bin/env bash
set -e

DEBUG=false

run() {
  cd /home/volumio/NP-01_buttons
  node app/index.js
}

if [ "$DEBUG" = true ]; then
  run >>/home/volumio/NP-01_buttons/run.log 2>&1
else
  run &>/dev/null
fi
