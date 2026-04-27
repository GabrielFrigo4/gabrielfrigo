#!/bin/sh
set -e

KEY="$HOME/.key/ssh-key-frigo-server.key"
USER_HOST="ubuntu@144.22.210.65"
TARGET_PATH="/home/ubuntu/$1"

ssh -i "$KEY" "$USER_HOST" "rm -rf \"$TARGET_PATH\""
scp -r -i "$KEY" "$1" "$USER_HOST:$TARGET_PATH"
