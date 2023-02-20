#!/usr/bin/env bash
set -ex

{
  cd /home/volumio/NP-01_buttons
  {
    npm i --only=prod
  } || {
    sleep 10 && npm i --only=prod
  }
  node index.js
} >/home/volumio/NP-01_buttons/run.log 2>&1
