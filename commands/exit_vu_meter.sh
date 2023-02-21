#!/usr/bin/env bash

kill $(ps ax | grep 'python3 volumio_peppymeter.py' | grep -v grep | awk '{print $1}')
