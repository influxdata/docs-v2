#!/bin/bash

## This script is meant to be run on the host and monitors a file for URLs written by a container.
DOCS_ROOT=$(git rev-parse --show-toplevel)
# The file to monitor for URLs written by the container.
URL_FILE=$DOCS_ROOT/test/shared/urls.txt
# Define the URL pattern for OAuth2 authorization.
OAUTH_PATTERN='https://auth\.influxdata\.com/activate\?user_code=[A-Z]{1,8}-[A-Z]{1,8}'

# Loop indefinitely
while true; do
  if [ -f "$URL_FILE" ]; then
    # Extract an OAuth2 authorization URL from the file
    URL=$(grep -Eo "$OAUTH_PATTERN" "$URL_FILE")
    if [ "$URL" ]; then
      # Open the URL in the default browser
      open "$URL"
      # Clear the file to indicate the URL has been handled
      > "$URL_FILE"
    fi
  fi
  sleep 1
done
