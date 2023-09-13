---
title: JSON output data format
list_title: JSON
description: Use the `json` output data format (serializer) to format and output Telegraf metrics as JSON documents.
menu:
  telegraf_v1_ref:
    name: JSON
    weight: 10
    parent: Output data formats
    identifier: output-data-format-json
---

Use the `json` output data format (serializer) to format and output Telegraf metrics as [JSON](https://www.json.org/json-en.html) documents.

## Configuration

```toml
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout", "/tmp/metrics.out"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "json"

  ## The resolution to use for the metric timestamp.  Must be a duration string
  ## such as "1ns", "1us", "1ms", "10ms", "1s".  Durations are truncated to
  ## the power of 10 less than the specified units.
  json_timestamp_units = "1s"
```

## Examples

### Standard format

```json
{
    "fields": {
        "field_1": 30,
        "field_2": 4,
        "field_N": 59,
        "n_images": 660
    },
    "name": "docker",
    "tags": {
        "host": "raynor"
    },
    "timestamp": 1458229140
}
```

### Batch format

When an output plugin needs to emit multiple metrics at one time, it may use the
batch format.  The use of batch format is determined by the plugin -- reference
the documentation for the specific plugin.

```json
{
    "metrics": [
        {
            "fields": {
                "field_1": 30,
                "field_2": 4,
                "field_N": 59,
                "n_images": 660
            },
            "name": "docker",
            "tags": {
                "host": "raynor"
            },
            "timestamp": 1458229140
        },
        {
            "fields": {
                "field_1": 30,
                "field_2": 4,
                "field_N": 59,
                "n_images": 660
            },
            "name": "docker",
            "tags": {
                "host": "raynor"
            },
            "timestamp": 1458229140
        }
    ]
}
```
