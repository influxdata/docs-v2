---
title: JSON output data format
list_title: JSON
description: >
  Use the `json` output data format (serializer) to format Telegraf metrics
  as JSON documents, and reshape the output with JSONata transformations.
menu:
  telegraf_v1_ref:
    name: JSON
    parent: Output data formats
    identifier: output-data-format-json
weight: 10
related:
  - /telegraf/v1/configure_plugins/output_plugins/serialize-data/
  - /telegraf/v1/data_formats/input/json/
---

Use the `json` output data format (serializer) to format Telegraf metrics
as [JSON](https://www.json.org/json-en.html) documents.

- [Configuration](#configuration)
- [Option reference](#option-reference)
- [Standard and batch format](#standard-and-batch-format)
- [Transformations](#transformations)

## Configuration

```toml
[[outputs.file]]
  files = ["stdout", "/tmp/metrics.out"]
  data_format = "json"

  ## The resolution to use for the metric timestamp.
  json_timestamp_units = "1s"

  ## Timestamp layout; Unix epoch time if not set.
  # json_timestamp_format = ""

  ## A JSONata transformation of the output.
  # json_transformation = ""

  ## Filters for fields that contain nested JSON to decode.
  # json_nested_fields_include = []
  # json_nested_fields_exclude = []
```

## Option reference

### json_timestamp_units

The resolution of the metric timestamp.
Must be a duration string, such as `1ns`, `1us`, `1ms`, or `1s`.
Durations are truncated to the power of 10 less than the specified units.

**Type:** string (duration)  
**Default:** `"1s"`

### json_timestamp_format

A [Go reference time](https://pkg.go.dev/time#Time.Format) layout for the
timestamp, such as `2006-01-02T15:04:05Z07:00` for RFC 3339.
If not set, timestamps are Unix epoch numbers at the resolution set by
`json_timestamp_units`.

**Type:** string  
**Default:** Not set

### json_transformation

A [JSONata](https://jsonata.org/) expression that transforms the serialized
metric before writing.
See [Transformations](#transformations).

**Type:** string  
**Default:** Not set

### json_nested_fields_include and json_nested_fields_exclude

Filters for string fields that contain valid nested JSON.
Matching fields are decoded into JSON structures in the output instead of
being emitted as escaped strings.
Decoding happens before any transformation.
Both filters support wildcards.

**Type:** array of strings  
**Default:** `[]`

## Standard and batch format

In standard (non-batch) mode, each metric serializes to one document:

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

When an output plugin emits multiple metrics at one time, it can use the
batch format, which collects all metrics in a top-level `metrics` array:

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
                "field_1": 12,
                "field_N": 27,
                "n_images": 72
            },
            "name": "docker",
            "tags": {
                "host": "amaranth"
            },
            "timestamp": 1458229140
        }
    ]
}
```

Whether batch format is used depends on the output plugin and, for plugins
that support it, the `use_batch_format` option.
See
[How output plugins use serializers](/telegraf/v1/data_formats/output/#how-output-plugins-use-serializers).

## Transformations

Use the `json_transformation` option to reshape the output with a
[JSONata](https://jsonata.org/) expression.
The input to the transformation is the serialized metric in the standard
form above, or the batch form when the plugin writes batches.

> [!Note]
> JSONata support is limited to version 1.5.4 due to the underlying
> library.
> When using the [JSONata playground](https://try.jsonata.org) or the
> documentation examples, make sure version 1.5.4 is selected.

Use multiline TOML strings (`'''`) for readable expressions.

### Flatten a metric

The following transformation merges the name, timestamp, tags, and fields
into one flat object:

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "json"
  json_transformation = '''
  $merge([{"name": name, "timestamp": timestamp}, tags, fields])
  '''
```

Output:

```json
{
  "name": "docker",
  "timestamp": 1458229140,
  "host": "raynor",
  "field_1": 30,
  "field_2": 4,
  "field_N": 59,
  "n_images": 660
}
```

### Compute and rename values

JSONata expressions can rename keys, do arithmetic, and format timestamps.
The following transformation sums all `field_*` fields, renames values,
and converts the epoch timestamp to RFC 3339:

```toml
[[outputs.file]]
  files = ["stdout"]
  data_format = "json"
  json_transformation = '''
  {
      "capacity": $sum($sift($.fields, function($value, $key) {$key ~> /^field_/}).*),
      "images": fields.n_images,
      "host": tags.host,
      "time": $fromMillis(timestamp * 1000)
  }
  '''
```

Output:

```json
{
  "capacity": 93,
  "images": 660,
  "host": "raynor",
  "time": "2016-03-17T15:39:00.000Z"
}
```

### Combine metrics in a batch

In batch mode, the transformation receives the whole `metrics` array and
can restructure and combine entries.
The following transformation groups image counts by host and lists hosts
with low image counts:

```toml
[[outputs.file]]
  files = ["stdout"]
  use_batch_format = true
  data_format = "json"
  json_transformation = '''
  {
      "time": $min(metrics.timestamp) * 1000 ~> $fromMillis(),
      "images": metrics{
          tags.host: {
              name: fields.n_images
          }
      },
      "capacity alerts": metrics[fields.n_images < 10].[(tags.host & " " & name)]
  }
  '''
```

Output:

```json
{
  "time": "2016-03-17T15:39:00.000Z",
  "images": {
    "raynor": {
      "docker": 660
    },
    "amaranth": {
      "docker": 72,
      "storage": 0
    }
  },
  "capacity alerts": [
    "amaranth storage"
  ]
}
```

> [!Note]
> Batch and non-batch modes produce different transformation input.
> Batch mode wraps metrics in a `metrics` array; non-batch mode passes each
> metric directly.
> An expression written for one mode doesn't work in the other.

For more elaborate expressions, see the
[JSONata documentation](https://docs.jsonata.org).
