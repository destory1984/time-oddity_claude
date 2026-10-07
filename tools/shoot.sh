#!/bin/sh
# Takes 375 x 812 stills of the built game (play/) with headless Chrome.
# Usage, from the repository root: tools/shoot.sh <out-dir> <hash> [<hash> ...]
#   e.g. tools/shoot.sh /tmp/shots shot=lunar1504,sky shot=globe
CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
OUT="$1"; shift
mkdir -p "$OUT"
ROOT=$(pwd -W 2>/dev/null || pwd)
for HASH in "$@"; do
  NAME=$(printf '%s' "$HASH" | tr -c 'A-Za-z0-9\n' '-')
  "$CHROME" --headless=new --hide-scrollbars --allow-file-access-from-files --window-size=375,812 \
    --virtual-time-budget=4000 --screenshot="$(cd "$OUT" && (pwd -W 2>/dev/null || pwd))/$NAME.png" \
    "file:///$ROOT/play/index.html#$HASH" >/dev/null 2>&1
done
ls "$OUT"
