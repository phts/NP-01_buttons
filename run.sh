#!/usr/bin/env bash
set -e

cd /home/volumio/NP-01_buttons
npm i --omit=dev
node index.js
