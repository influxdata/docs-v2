#!/bin/bash

# Function to check if an option is present in the arguments
has_option() {
    local target="$1"
    shift
    for arg in "$@"; do
        if [ "$arg" == "$target" ]; then
            return 0
        fi
    done
    return 1
}

verbose=0
# Check if "--option" is present in the CMD arguments
if has_option "-v" "$@"; then
    verbose=1
    echo "Using verbose mode..."
fi

if [ -z "$TEMP_DIR" ]; then
  TEMP_DIR=./tmp
fi

# Parse YAML config files into dotenv files
curl -sO https://raw.githubusercontent.com/mrbaseman/parse_yaml/master/src/parse_yaml.sh
source ./parse_yaml.sh && parse_yaml ./data/products.yml > .env.products

# Load shell environment variables from .env files generated in the build (not provided at build-time.
# To provide .env files available at build-time, set them in the docker compose file).
set -a && source .env.products && set +a

cd $TEMP_DIR

for file in `find . -type f` ; do
  if [ -f "$file" ]; then
    echo "PROCESSING $file"

    # Replaces placeholder values with environment variable references.

    # Non-language-specific replacements.
    sed -i 's|https:\/\/{{< influxdb/host >}}|$INFLUX_HOST|g;
    ' $file

    # Python-specific replacements.
    # Use f-strings to identify placeholders in Python while also keeping valid syntax if
    # the user replaces the value.
    # Remember to import os for your example code.
    sed -i 's/f"DATABASE_TOKEN"/os.getenv("INFLUX_TOKEN")/g;
    s/f"API_TOKEN"/os.getenv("INFLUX_TOKEN")/g;
    s/f"BUCKET_NAME"/os.getenv("INFLUX_DATABASE")/g;
    s/f"DATABASE_NAME"/os.getenv("INFLUX_DATABASE")/g;
    s|f"{{< influxdb/host >}}"|os.getenv("INFLUX_HOSTNAME")|g;
    ' $file

    # Shell-specific replacements.
    sed -i 's/API_TOKEN/$INFLUX_TOKEN/g;
    s/ORG_ID/$INFLUX_ORG/g;
    s/ORG/$INFLUX_ORG/g;
    s/DATABASE_TOKEN/$INFLUX_TOKEN/g;
    s/BUCKET_NAME/$INFLUX_DATABASE/g;
    s/DATABASE_NAME/$INFLUX_DATABASE/g;
    s/get-started/$INFLUX_DATABASE/g;
    s/CONFIG_NAME/CONFIG_$(shuf -i 0-100 -n1)/g;' \
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
  if [ $verbose -eq 1 ]; then
    echo "FILE CONTENTS:"
    cat $file
  fi
done

# Miscellaneous test setup.
# For macOS samples.
mkdir -p ~/Downloads && rm -rf ~/Downloads/*
# Clean up installed files from previous runs.
gpg -q --batch --yes --delete-key D8FF8E1F7DF8B07E > /dev/null 2>&1

# Run test commands with options provided in the CMD of the Dockerfile.
pytest --codeblocks . "$@"