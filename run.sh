#!/usr/bin/env bash
set -ex

{
  cd /home/volumio/NP-01_buttons
  {
    npm i --omit=dev
  } || {
    sleep 10 && npm i --omit=dev
  }
  node index.js
} >/home/volumio/NP-01_buttons/run.log 2>&1
