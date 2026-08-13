---
title: CloudEvents output data format
list_title: CloudEvents
description: Use the `cloudevents` output data format (serializer) to format Telegraf metrics as CloudEvents in JSON format.
menu:
  telegraf_v1_ref:
    name: CloudEvents
    parent: Output data formats
    identifier: output-data-format-cloudevents
weight: 10
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
  ##   creation -- use timestamp of event creation
  ## For events containing only a single metric, earliest and latest are
  ## equivalent.
  # cloudevents_event_time = "latest"

  ## Batch format of the output when running in batch mode.
  ## If set to 'events' the output contains a list of events, each with a
  ## single metric, according to the JSON Batch Format of the
  ## specification. Use 'application/cloudevents-batch+json' for this
  ## format.
  ## When set to 'metrics', a single event is generated containing a list
  ## of metrics as payload. Use 'application/cloudevents+json' for this
  ## format.
  # cloudevents_batch_format = "events"
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cloudevents_version` | string | `"1.0"` | CloudEvents specification version (`"0.3"` or `"1.0"`) |
| `cloudevents_source` | string | `"telegraf"` | Event source identifier |
| `cloudevents_source_tag` | string | `""` | Tag to use as source (overrides `cloudevents_source`) |
| `cloudevents_event_type` | string | auto | Event type (auto-detected based on single/batch) |
| `cloudevents_event_time` | string | `"latest"` | Event timestamp: `"none"`, `"earliest"`, `"latest"`, or `"creation"` |
| `cloudevents_batch_format` | string | `"events"` | Batch mode output: `"events"` (one event per metric) or `"metrics"` (one event containing all metrics) |

## Event types

By default, the serializer sets the event type based on the content:
- Single metric: `com.influxdata.telegraf.metric`
- Batch of metrics: `com.influxdata.telegraf.metrics`

Use `cloudevents_event_type` to override this behavior.
