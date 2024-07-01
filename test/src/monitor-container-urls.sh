#!/bin/bash

## This script is meant to be run on the host and monitors a file for URLs written by a container.

# The file to monitor for URLs written by the container.
FILE="./test/shared/urls.txt"
# Define the URL pattern for OAuth2 authorization.
OAUTH_PATTERN='https://auth\.influxdata\.com/activate\?user_code=[A-Z]{1,8}-[A-Z]{1,8}'

# Loop indefinitely
while true; do
  if [ -f "$FILE" ]; then
    # Extract an OAuth2 authorization URL from the file
    URL=$(grep -Eo "$OAUTH_PATTERN" "$FILE")
    if [ "$URL" ]; then
      # Open the URL in the default browser
      open "$URL"
      # Clear the file to indicate the URL has been handled
      > "$FILE"
    fi
  fi
  sleep 1
done
