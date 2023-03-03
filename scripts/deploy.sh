#/usr/bin/env bash
set -e

CURRENT_COMMIT=$(git rev-parse HEAD)

ssh volumio <<EOF
  cd ~/NP-01_buttons
  git fetch
  git checkout ${CURRENT_COMMIT}
  npm i --only=prod
EOF
