#!/bin/bash

# This script is used to run tests for the InfluxDB documentation.
# The script is designed to be run in a Docker container. It is used to substitute placeholder values in test files.
TEST_CONTENT="/app/content"
# Pattern to match a 10-digit Unix timestamp
TIMESTAMP_PATTERN='[0-9]{10}'

NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
YESTERDAY=$(date -u -d 'yesterday 00:00' '+%Y-%m-%dT%H:%M:%SZ')

function substitute_placeholders {
  for file in `find "$TEST_CONTENT" -type f \( -iname '*.md' \)`; do
    if [ -f "$file" ]; then
      # echo "PRETEST: substituting values in $file"

      # Replaces placeholder values with environment variable references.
      # Date-specific replacements.

      grep -oE "$TIMESTAMP_PATTERN" "$file" | while read -r timestamp; do
        # Replace Unix timestamps (for example, in line protocol sample data) with yesterday's date.
        # Assuming the Unix timestamp is the whole line or a standalone word in the line
        # Validate the extracted timestamp (optional)
        if [[ $timestamp =~ ^1641[0-9]{6,12}$ ]]; then
          specific_timestamp=$timestamp          

          # Extract the time part
          specific_time=$(date -u -d "@$specific_timestamp" '+%T')
          
          # Calculate 'yesterday' date but use 'specific_time' for the time part
          yesterday_date=$(date -u -d 'yesterday' '+%Y-%m-%d')
          yesterday_datetime="$yesterday_date"T"$specific_time"Z
          
          # Convert 'yesterday_datetime' to Unix timestamp
          yesterday_timestamp=$(date -u -d "$yesterday_datetime" +%s)

          # Replace the extracted timestamp with `yesterday_timestamp`
          sed -i "s|$specific_timestamp|$yesterday_timestamp|g;" $file  
        fi
      done

      ## Adjust time bounds in queries to be the current time and yesterday.
      sed -i "s|'2022-01-01T20:00:00Z'|'$NOW'|g;
      s|'2022-01-01T08:00:00Z'|'$YESTERDAY'|g; 
      " $file

      # Non-language-specific replacements.
      sed -i 's|https:\/\/{{< influxdb/host >}}|$INFLUX_HOST|g;' $file

      # Python-specific replacements.
      # Use f-strings to identify placeholders in Python while also keeping valid syntax if
      # the user replaces the value.
      # Remember to import os for your example code.
      sed -i 's/f"ACCOUNT_ID"/os.getenv("ACCOUNT_ID")/g;
      s/f"API_TOKEN"/os.getenv("INFLUX_TOKEN")/g;
      s/f"BUCKET_NAME"/os.getenv("INFLUX_DATABASE")/g;
      s/f"CLUSTER_ID"/os.getenv("CLUSTER_ID")/g;
      s/f"DATABASE_NAME"/os.getenv("INFLUX_DATABASE")/g;
      s/f"DATABASE_TOKEN"/os.getenv("INFLUX_TOKEN")/g;
      s/f"get-started"/os.getenv("INFLUX_DATABASE")/g;
      s|f"{{< influxdb/host >}}"|os.getenv("INFLUX_HOSTNAME")|g;
      s/f"MANAGEMENT_TOKEN"/os.getenv("INFLUX_MANAGEMENT_TOKEN")/g;
      s|f"RETENTION_POLICY_NAME\|RETENTION_POLICY"|"autogen"|g;
      ' $file

      # Shell-specific replacements.
      ## In JSON Heredoc
      sed -i 's|"orgID": "ORG_ID"|"orgID": "$INFLUX_ORG"|g;
      s|"name": "BUCKET_NAME"|"name": "$INFLUX_DATABASE"|g;' \
      $file

      # Replace remaining placeholders with variables.
      # If the placeholder is inside of a Python os.getenv() function, don't replace it.
      # Note the specific use of double quotes for the os.getenv() arguments here. You'll need to use double quotes in your code samples for this to match.
      sed -i '/os.getenv("ACCOUNT_ID")/! s/ACCOUNT_ID/$ACCOUNT_ID/g;
      /os.getenv("API_TOKEN")/! s/API_TOKEN/$INFLUX_TOKEN/g;
      /os.getenv("BUCKET_ID")/! s/--bucket-id BUCKET_ID/--bucket-id $INFLUX_BUCKET_ID/g;
      /os.getenv("BUCKET_NAME")/! s/BUCKET_NAME/$INFLUX_DATABASE/g;
      /os.getenv("CLUSTER_ID")/! s/CLUSTER_ID/$CLUSTER_ID/g;
      s/0x000000-xy00-0xy-x00-0x00y0000000/$CLUSTER_ID/g;
      /os.getenv("DATABASE_TOKEN")/! s/DATABASE_TOKEN/$INFLUX_TOKEN/g;
      /os.getenv("DATABASE_NAME")/! s/DATABASE_NAME/$INFLUX_DATABASE/g;
      s/--id DBRP_ID/--id $INFLUX_DBRP_ID/g;
      s/example-db/$INFLUX_DATABASE/g;
      s/get-started/$INFLUX_DATABASE/g;
      /os.getenv("MANAGEMENT_TOKEN")/! s/INFLUX_MANAGEMENT_TOKEN/$MANAGEMENT_TOKEN/g;
      /os.getenv("ORG_ID")/! s/ORG_ID/$INFLUX_ORG/g;
      /os.getenv("RETENTION_POLICY")/! s/RETENTION_POLICY_NAME\|RETENTION_POLICY/$INFLUX_RETENTION_POLICY/g;
      s/CONFIG_NAME/CONFIG_$(shuf -i 0-100 -n1)/g;
      s/TEST_RUN/TEST_RUN_$(date +%s)/g' \
      $file

      # v2-specific replacements.
      sed -i 's|https:\/\/us-west-2-1.aws.cloud2.influxdata.com|$INFLUX_HOST|g;
      s|{{< latest-patch >}}|${influxdb_latest_patches_v2}|g;
      s|{{< latest-patch cli=true >}}|${influxdb_latest_cli_v2}|g;' \
      $file

      # Skip package manager commands.
      sed -i 's|sudo dpkg.*$||g;
      s|sudo yum.*$||g;' \
      $file

      # Environment-specific replacements.
      sed -i 's|sudo ||g;' \
      $file
    fi
  done
}

setup() {
  # Set up the environment for the tests.
  # Parse YAML config files into dotenv files to be used by tests.
  mkdir -p /app/appdata && (parse_yaml /src/data/products.yml > /app/appdata/.env.products)

  # Miscellaneous test setup.
  # For macOS samples.
  mkdir -p ~/Downloads && rm -rf ~/Downloads/*
}

prepare_tests() {
  echo "Preparing test files: $*"
  SRC_FILES="$*"

  # Copy the test files to the target directory while preserving the directory structure.
  cd /src
  for FILE in $SRC_FILES; do
    rsync -az --relative "$FILE" /app/
  done
  cd /app
  substitute_placeholders
  setup
}

prepare_tests "$*"
