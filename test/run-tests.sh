#!/bin/bash

for file in `find . -type f` ; do
  if [ -f "$file" ]; then
    echo "PROCESSING $file"

    # Replace placeholder values with environment variables.
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
    s/DATABASE_TOKEN/$INFLUX_TOKEN/g;
    s/BUCKET_NAME/$INFLUX_DATABASE/g;
    s/DATABASE_NAME/$INFLUX_DATABASE/g;
    s/get-started/$INFLUX_DATABASE/g;' \
    $file

    # v2-specific replacements.
    sed -i 's|https:\/\/us-west-2-1.aws.cloud2.influxdata.com|$INFLUX_HOST|g;
    s|{{< latest-patch >}}|${LATEST_PATCH}|g;
    s|sudo dpkg.*$||g;
    s|sudo yum.*$||g;
    s|sudo ||g;' \
    $file
  fi
  cat $file
done

pytest --codeblocks .
