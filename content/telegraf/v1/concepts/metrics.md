---
title: Telegraf metrics
description: >
  Telegraf metrics are the internal representation used to model data during
  processing. Each metric includes a measurement name, tags, fields, and a
  timestamp.
menu:
  telegraf_v1:
    name: Telegraf metrics
    parent: How Telegraf works
weight: 101
aliases:
  - /telegraf/v1/metrics/
related:
  - /telegraf/v1/concepts/data-pipeline/
  - /telegraf/v1/data_formats/output/
  - /telegraf/v1/data_formats/output/influx/
---

Telegraf metrics are the internal representation used to model data during
processing.
Metrics are closely based on InfluxDB's data model and contain four main
components:

- **Measurement name**: the description and namespace for the metric, such as
  `cpu` or `mem`.
- **Tags**: key-value string pairs, usually used to identify the source of the
  metric, such as the host name or region.
- **Fields**: typed key-value pairs that contain the metric data, such as a
  numeric usage value.
- **Timestamp**: the date and time associated with the fields.

For example, the following metric, shown in InfluxDB line protocol, has the
measurement name `cpu`, two tags, two fields, and a nanosecond timestamp:

```text
cpu,host=web01,cpu=cpu0 usage_idle=92.5,usage_user=4.2 1717000000000000000
```

When deciding how to structure data, use tags for string values that identify
and filter metrics, and use fields for the measured values themselves.
Many destinations, including InfluxDB, index tags, so filtering by tag is
more efficient than filtering by field.

## Serializing metrics

Telegraf holds metrics in memory as it moves them through the
[data pipeline](/telegraf/v1/concepts/data-pipeline/).
To write, transmit, or view metrics, Telegraf converts each one to a concrete
representation using an [output data format](/telegraf/v1/data_formats/output/)
(also known as a *serializer*).

While InfluxDB is the primary output target for Telegraf, Telegraf is not
tied to it: serializers convert metrics to formats such as Prometheus,
Graphite, JSON, and CSV, and
[output plugins](/telegraf/v1/plugins/#output-plugins) deliver them to many
different destinations, including databases, message queues, and cloud
services.
The default serializer converts metrics to
[InfluxDB line protocol](/telegraf/v1/data_formats/output/influx/), which
provides a high-performance, one-to-one mapping from Telegraf metrics.

> [!Note]
> By default, metrics awaiting delivery are held only in memory and are lost
> if Telegraf stops.
> To persist pending metrics to disk, use the `disk`
> [buffer strategy](/telegraf/v1/concepts/data-pipeline/#buffering-and-delivery).

## Tracking metrics

Tracking metrics ensure that data is passed from an input and handed to an
output before Telegraf acknowledges the message back to the input.
Use them with queue-based sources to make sure messages reach the destination
before the source removes them.

For example, if a configuration reads from MQTT, Kafka, or an AMQP source,
Telegraf reads the message and waits until the metric is handed to the output
before telling the source that the message was read.
If Telegraf stops or the host crashes, messages that were not completely
delivered to an output are re-read later.

> [!Note]
> Delivery acknowledgment applies only to internal plugins.
> For [external plugins](/telegraf/v1/configure_plugins/external_plugins/),
> Telegraf acknowledges metrics regardless of the actual output.

### Undelivered messages

When an input uses tracking metrics, the plugin provides an additional
`max_undelivered_messages` setting that determines how many messages Telegraf
reads before requiring acknowledgments.
In practice, Telegraf might not read new messages from an input at every
collection interval.

Use caution with this setting.
Setting the value too high can cause Telegraf to push constant batches to an
output and ignore the flush interval.
