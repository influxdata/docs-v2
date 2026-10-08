---
title: Parquet input data format
list_title: Parquet
description: >
  Use the `parquet` input data format to parse Apache Parquet files into
  Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Parquet
    parent: Input data formats
weight: 10
related:
  - /telegraf/v1/input-plugins/file/
  - /telegraf/v1/data_formats/input/csv/
---

Use the `parquet` input data format to parse
[Apache Parquet](https://parquet.apache.org/) files into Telegraf metrics.
Each row in the Parquet file becomes a metric, with columns mapped to
fields unless configured as tags, the measurement name, or the timestamp.

## Configuration

```toml
[[inputs.file]]
  files = ["metrics.parquet"]
  data_format = "parquet"

  ## Columns to store as tags instead of fields.
  # tag_columns = []

  ## Column to use as the measurement name.
  # measurement_column = ""

  ## Column containing the metric timestamp.
  ## If not set, the time of parsing is used.
  # timestamp_column = ""

  ## Format of the timestamp in timestamp_column.
  # timestamp_format = ""

  ## Timezone for timestamps that don't include an offset.
  # timestamp_timezone = ""
```

### tag_columns

Columns to store as tags instead of fields.

**Type:** array of strings  
**Default:** `[]`

### measurement_column

The column to use as the measurement name.
If not set, the input plugin's default measurement name is used.

**Type:** string  
**Default:** Not set

### timestamp_column

The column containing the time for each metric.
If not set, the time of parsing becomes the timestamp.

**Type:** string  
**Default:** Not set

### timestamp_format

The layout of values in `timestamp_column`.
Use `unix`, `unix_ms`, `unix_us`, `unix_ns`, or a
[Go reference time](https://pkg.go.dev/time#pkg-constants) layout such as
`2006-01-02T15:04:05Z07:00`.
For reference-time details, see
[Parse timestamps](/telegraf/v1/configure_plugins/input_plugins/parse-data/#parse-timestamps).

**Type:** string  
**Default:** Not set

### timestamp_timezone

Timezone for timestamps that don't include an offset, such as
`04/06/2016 12:41:45`.
Use a Unix TZ value, such as `America/New_York`, `Local` to use the system
timezone, or `UTC`.

**Type:** string  
**Default:** `""` (UTC)
