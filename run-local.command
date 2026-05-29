#!/bin/zsh
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Please install Node.js first: https://nodejs.org/"
  echo
  read -k 1 "?Press any key to close..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

LOG_FILE="$(mktemp -t icon-maker.XXXXXX.log)"

open_when_ready() {
  local url=""
  for _ in {1..120}; do
    url="$(grep -Eo 'http://127\.0\.0\.1:[0-9]+/' "$LOG_FILE" | head -1 || true)"
    if [ -n "$url" ]; then
      open "$url"
      return
    fi
    sleep 0.25
  done
}

open_when_ready &

echo "Starting Icon Maker..."
echo "Project: $PROJECT_DIR"
echo

npm run dev 2>&1 | tee "$LOG_FILE"
