---
title: CloudEvents output data format
list_title: CloudEvents
description: Use the `cloudevents` output data format (serializer) to format Telegraf metrics as CloudEvents in JSON format.
menu:
  telegraf_v1_ref:
    name: CloudEvents
    weight: 10
    parent: Output data formats
    identifier: output-data-format-cloudevents
---

Use the `cloudevents` output data format (serializer) to format Telegraf metrics as [CloudEvents](https://cloudevents.io) in [JSON format](https://github.com/cloudevents/spec/blob/v1.0/json-format.md).
Versions v1.0 and v0.3 of the CloudEvents specification are supported, with v1.0 as the default.

## Configuration

```toml
[[outputs.file]]
  files = ["stdout", "/tmp/metrics.out"]

  ## Data format to output.
  data_format = "cloudevents"

  ## Specification version to use for events.
  ## Supported versions: "0.3" and "1.0" (default).
  # cloudevents_version = "1.0"

  ## Event source specifier.
  ## Overwrites the source header field with the given value.
  # cloudevents_source = "telegraf"

  ## Tag to use as event source specifier.
  ## Overwrites the source header field with the value of the specified tag.
  ## Takes precedence over 'cloudevents_source' if both are set.
  ## Falls back to 'cloudevents_source' if the tag doesn't exist for a metric.
  # cloudevents_source_tag = ""

  ## Event-type specifier to overwrite the default value.
  ## Default for single metric: 'com.influxdata.telegraf.metric'
  ## Default for batch: 'com.influxdata.telegraf.metrics' (plural)
  # cloudevents_event_type = ""

  ## Set time header of the event.
  ## Supported values:
  ##   none     -- do not set event time
  ##   earliest -- use timestamp of the earliest metric
  ##   latest   -- use timestamp of the latest metric
  # cloudevents_time = "earliest"
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cloudevents_version` | string | `"1.0"` | CloudEvents specification version (`"0.3"` or `"1.0"`) |
| `cloudevents_source` | string | `"telegraf"` | Event source identifier |
| `cloudevents_source_tag` | string | `""` | Tag to use as source (overrides `cloudevents_source`) |
| `cloudevents_event_type` | string | auto | Event type (auto-detected based on single/batch) |
| `cloudevents_time` | string | `"earliest"` | Event timestamp: `"none"`, `"earliest"`, or `"latest"` |

## Event types

By default, the serializer sets the event type based on the content:
- Single metric: `com.influxdata.telegraf.metric`
- Batch of metrics: `com.influxdata.telegraf.metrics`

Use `cloudevents_event_type` to override this behavior.
