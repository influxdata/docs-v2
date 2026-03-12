---
title: CSV output data format
list_title: CSV
description: Use the `csv` output data format (serializer) to convert Telegraf metrics into CSV lines.
menu:
  telegraf_v1_ref:
    name: CSV
    weight: 10
    parent: Output data formats
    identifier: output-data-format-csv
---

Use the `csv` output data format (serializer) to convert Telegraf metrics into CSV (Comma-Separated Values) lines.

## Configuration

```toml
[[outputs.file]]
  files = ["stdout", "/tmp/metrics.out"]

  ## Data format to output.
  data_format = "csv"

  ## Timestamp format.
  ## Default is Unix epoch time. Use Go time layout for custom formats.
  ## See: https://golang.org/pkg/time/#Time.Format
  # csv_timestamp_format = "unix"

  ## Field separator character.
  # csv_separator = ","

  ## Output the CSV header in the first line.
  ## Enable when writing to a new file.
  ## Disable when appending or using stateless outputs to prevent
  ## headers appearing between data lines.
  # csv_header = false

  ## Prefix tag and field columns with "tag_" and "field_" respectively.
  # csv_column_prefix = false

  ## Specify column order.
  ## Use "tag." prefix for tags, "field." prefix for fields,
  ## "name" for measurement name, and "timestamp" for the timestamp.
  ## Only specified columns are included; others are dropped.
  ## Default order: timestamp, name, tags (alphabetical), fields (alphabetical)
  # csv_columns = ["timestamp", "name", "tag.host", "field.value"]
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `csv_timestamp_format` | string | `"unix"` | Timestamp format (Unix epoch or Go time layout) |
| `csv_separator` | string | `","` | Field separator character |
| `csv_header` | boolean | `false` | Output CSV header row |
| `csv_column_prefix` | boolean | `false` | Prefix columns with `tag_` or `field_` |
| `csv_columns` | array | `[]` | Explicit column order (empty = all columns) |

## Examples

### Basic CSV output

```toml
[[outputs.file]]
  files = ["/tmp/metrics.csv"]
  data_format = "csv"
  csv_header = true
```

**Input metric:**
```
cpu,host=server01 usage_idle=98.5,usage_user=1.2 1640000000000000000
```

**Output:**
```csv
timestamp,name,host,usage_idle,usage_user
1640000000,cpu,server01,98.5,1.2
```

### Custom column order

```toml
[[outputs.file]]
  files = ["/tmp/metrics.csv"]
  data_format = "csv"
  csv_header = true
  csv_columns = ["timestamp", "tag.host", "field.usage_idle"]
```

**Output:**
```csv
timestamp,host,usage_idle
1640000000,server01,98.5
```

### Custom timestamp format

```toml
[[outputs.file]]
  files = ["/tmp/metrics.csv"]
  data_format = "csv"
  csv_timestamp_format = "2006-01-02T15:04:05Z07:00"
```
