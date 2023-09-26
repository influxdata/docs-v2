#!/bin/bash

for file in "$TEST_DIR"/*; do
  if [ -f "$file" ]; then
    # Replace placeholder values with environment variables.
    sed -i '' 's|https:\/\/{{< influxdb/host >}}|$INFLUX_HOST|g;
    s/API_TOKEN/$INFLUX_TOKEN/g;
    s/DATABASE_TOKEN/$INFLUX_TOKEN/g;
    s/BUCKET_NAME/$INFLUX_DATABASE/g;
    s/DATABASE_NAME/$INFLUX_DATABASE/g;' \
    $file
  fi
done

pytest --codeblocks $TEST_DIR
