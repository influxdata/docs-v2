---
title: Write data with output plugins
description: >
  Output plugins define where Telegraf delivers metrics. Learn how Telegraf
  batches, buffers, and retries writes, and how to send different metrics to
  different destinations.
menu:
  telegraf_v1:
    name: Output plugins
    parent: Use plugins
weight: 102
related:
  - /telegraf/v1/output-plugins/
  - /telegraf/v1/data_formats/output/
  - /telegraf/v1/concepts/data-pipeline/
  - /telegraf/v1/configuration/plugin-options/
---

Output plugins define where Telegraf delivers collected metrics.
Send metrics to InfluxDB or to a variety of other datastores, services, and
message queues, including Graphite, OpenTSDB, Datadog, Kafka, MQTT, and NSQ.

- [Choose an output plugin](#choose-an-output-plugin)
- [Configure an output plugin](#configure-an-output-plugin)
- [How Telegraf writes metrics](#how-telegraf-writes-metrics)
- [What happens when a write fails](#what-happens-when-a-write-fails)
- [Send different metrics to different outputs](#send-different-metrics-to-different-outputs)
- [Output plugins and data formats](#output-plugins-and-data-formats)

## Choose an output plugin

For the complete list, see
[output plugins](/telegraf/v1/output-plugins/) in the plugin directory.

## Configure an output plugin

Enable an output plugin by adding its
[table](/telegraf/v1/configuration/toml/#single-tables-and-arrays-of-tables) to
your TOML configuration file.
For example, the following configuration writes to InfluxDB 3:

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

You can configure multiple output plugins, and multiple instances of the
same plugin.
Each output receives every metric that passes its
[filters](/telegraf/v1/configuration/filtering/) and delivers metrics
independently of the other outputs.
Output plugins also support common options such as `alias`,
`flush_interval`, and `metric_batch_size`.
See [Common plugin options](/telegraf/v1/configuration/plugin-options/).

## How Telegraf writes metrics

Each output plugin has its own buffer of metrics waiting to be written.
Telegraf writes a batch of up to
[`metric_batch_size`](/telegraf/v1/configuration/plugin-options/#metric_batch_size)
metrics on every
[`flush_interval`](/telegraf/v1/configuration/plugin-options/#flush_interval),
or sooner when a full batch accumulates.
Batching amortizes connection and request overhead, so tune the batch size
to what your destination handles efficiently.

## What happens when a write fails

If a write fails, for example because the destination is unreachable, the
metrics in the batch stay in the output's buffer, and Telegraf retries them
on the next flush.
The buffer holds up to
[`metric_buffer_limit`](/telegraf/v1/configuration/plugin-options/#metric_buffer_limit)
metrics per output.
If the buffer fills while the destination is down, Telegraf drops the oldest
metrics to make room for new ones.

To ride out longer outages, you can raise the buffer limit or persist
buffers to disk with the agent `buffer_strategy` setting.
See [Buffering and delivery](/telegraf/v1/concepts/data-pipeline/#buffering-and-delivery).

Some output plugins can also report partial write results.
When a destination accepts part of a batch and rejects individual metrics
that can't be written, for example because they can't be serialized or they
violate a service constraint, the plugin marks the written metrics as
accepted, drops the rejected metrics, and keeps only the remainder in the
buffer for retry.

If the destination is unavailable when Telegraf starts, the
[`startup_error_behavior`](/telegraf/v1/configuration/plugin-options/#startup-error-behavior)
option controls whether Telegraf fails, ignores the plugin, or retries in
the background while buffering metrics.

## Send different metrics to different outputs

Output plugins apply [metric filters](/telegraf/v1/configuration/filtering/)
before writing, so each output can receive a different subset of the
pipeline's metrics.
For example, the following configuration writes only Kafka consumer metrics
to one output and everything else to another:

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
  namedrop = ["kafka_*"]

[[outputs.file]]
  files = ["/var/log/telegraf/kafka-metrics.out"]
  namepass = ["kafka_*"]
```

## Output plugins and data formats

Output plugins control *where* metrics go.
Many output plugins also support *data formats* (serializers) that control
how metrics are formatted before writing.

Configure a serializer using the `data_format` option in your output plugin:

```toml
[[outputs.http]]
  url = "http://example.com/metrics"
  data_format = "json"
```

Some output plugins (like `influxdb_v3` or `prometheus_client`) use a fixed
format and don't support `data_format`.
Others (like `file`, `http`, `kafka`) support multiple serializers.

The following guide shows how to choose and configure a serializer:

{{< children hlevel="h3" >}}
