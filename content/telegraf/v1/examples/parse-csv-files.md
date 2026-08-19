---
title: Parse CSV files from a directory
description: >
  Use the Telegraf directory_monitor input plugin and the CSV parser to
  ingest CSV files dropped into a directory and write the data to
  InfluxDB 3.
menu:
  telegraf_v1:
    name: Parse CSV files
    parent: Configuration examples
weight: 104
related:
  - /telegraf/v1/input-plugins/directory_monitor/
  - /telegraf/v1/data_formats/input/csv/
  - /telegraf/v1/configure_plugins/input_plugins/parse-data/
---

Watch a drop directory for CSV files, parse each file into metrics, and
move processed files out of the way.
This pattern suits batch workflows where devices, jobs, or exports write
CSV files on a schedule.

Given CSV files like the following:

```csv
node,temp,humidity,alarm,time
node1,32.3,23,false,2023-03-06T16:52:23Z
node2,22.6,44,false,2023-03-06T16:52:23Z
node3,17.9,56,true,2023-03-06T16:52:23Z
```

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.directory_monitor]]
  ## Directory to watch for new files.
  directory = "/var/telegraf/csv-drop"

  ## Move files here after successful processing.
  finished_directory = "/var/telegraf/csv-done"

  ## Move files here if parsing fails.
  error_directory = "/var/telegraf/csv-error"

  ## Only pick up CSV files.
  files_to_monitor = ['^.*\.csv$']

  ## Use the sensor readings measurement name.
  name_override = "sensors"

  ## Parse each file as CSV.
  data_format = "csv"
  csv_header_row_count = 1
  csv_tag_columns = ["node"]
  csv_timestamp_column = "time"
  csv_timestamp_format = "2006-01-02T15:04:05Z"

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database to write to

## How it works

- **`directory`** is the watched drop location.
  The plugin waits for a file to sit unchanged briefly (the
  `directory_duration_threshold` option, 50 ms by default) before
  ingesting it, so partially written files aren't read early.
  Increase the threshold if large files are copied in slowly.
- **`finished_directory` and `error_directory`** give every file a
  destination after processing.
  Files that fail parsing move to the error directory instead of blocking
  the pipeline, and you can inspect them later.
- **`files_to_monitor`** limits ingestion to file names matching the
  regular expression.
- **The CSV parser options** read the header row for column names, store
  the `node` column as a tag, and parse the `time` column as the metric
  timestamp using a
  [Go reference time](/telegraf/v1/configure_plugins/input_plugins/parse-data/#custom-timestamp-formats)
  layout.
  Remaining columns become fields.

## Example output

```text
sensors,node=node1 temp=32.3,humidity=23i,alarm=false 1678121543000000000
sensors,node=node2 temp=22.6,humidity=44i,alarm=false 1678121543000000000
sensors,node=node3 temp=17.9,humidity=56i,alarm=true 1678121543000000000
```

## Extend this example

- Set `file_tag = "file"` to tag each metric with the name of the file it
  came from. Watch series cardinality if file names vary widely.
- Set `recursive = true` to process nested directories.
- If your timestamps are Unix values in a local timezone, see
  [Parse CSV data with a local timestamp](/telegraf/v1/configure_plugins/input_plugins/parse-data/#parse-csv-data-with-a-local-timestamp).
- For all parser options, see the
  [CSV input data format](/telegraf/v1/data_formats/input/csv/).
