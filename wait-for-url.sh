#!/usr/bin/env bash
# Usage: ./wait-for-url.sh http://localhost:4000/health 30 2
# Arguments:
#  $1 - URL to poll (required)
#  $2 - max attempts (optional, default 30)
#  $3 - seconds between attempts (optional, default 2)

URL="$1"
MAX_ATTEMPTS="${2:-30}"
SLEEP_SECONDS="${3:-2}"

if [ -z "$URL" ]; then
  echo "Usage: $0 <url> [max_attempts] [sleep_seconds]"
  exit 2
fi

attempt=1
while [ $attempt -le $MAX_ATTEMPTS ]; do
  echo "Checking ${URL} (attempt ${attempt}/${MAX_ATTEMPTS})..."
  if curl -sfS --max-time 5 "$URL" > /dev/null 2>&1; then
    echo "OK: ${URL} is responding."
    exit 0
  fi
  attempt=$((attempt+1))
  sleep "$SLEEP_SECONDS"
done

echo "ERROR: ${URL} did not respond after ${MAX_ATTEMPTS} attempts."
exit 1
