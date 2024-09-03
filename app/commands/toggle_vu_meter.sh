#!/usr/bin/env bash

SERVICE=peppymeterbasic.service

systemctl is-active --quiet ${SERVICE} &&
  /bin/systemctl stop ${SERVICE} ||
  /bin/systemctl start ${SERVICE}
