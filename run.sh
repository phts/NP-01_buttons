#!/usr/bin/env bash
set -e

cd /home/volumio/NP-01_home-button
npm i --omit=dev
node index.js
