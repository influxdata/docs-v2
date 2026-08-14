---
title: How Telegraf works
description: >
  Learn Telegraf core concepts: plugin types, the metric data model, and the
  data pipeline that moves metrics from inputs through processors and
  aggregators to outputs.
menu:
  telegraf_v1:
    name: How Telegraf works
weight: 4
related:
  - /telegraf/v1/plugins/
  - /telegraf/v1/configure_plugins/
  - /telegraf/v1/configuration/
---

Telegraf is a plugin-driven agent.
A single Telegraf binary contains hundreds of plugins, and the plugins you
enable in your [configuration file](/telegraf/v1/configuration/) determine
what Telegraf collects, how it transforms that data, and where it writes it.

## Plugin types

Four plugin types form the Telegraf
[data pipeline](/telegraf/v1/concepts/data-pipeline/):

- **Input plugins** collect [metrics](/telegraf/v1/concepts/metrics/) from
  systems, services, databases, and sensors.
- **Processor plugins** transform, decorate, and filter metrics as they pass
  through the pipeline.
- **Aggregator plugins** produce new aggregate metrics, such as running means,
  minimums, and maximums, over configurable time windows.
- **Output plugins** write metrics to destinations such as InfluxDB, files,
  and message queues.

Two more plugin types extend how Telegraf runs:

- **Secret store plugins** keep credentials out of plain-text configuration
  files and resolve them at runtime.
  See [secret store plugins](/telegraf/v1/secretstore-plugins/).
- **External plugins** run outside the Telegraf binary, in any language,
  through the `execd` family of plugins.
  See [external plugins](/telegraf/v1/configure_plugins/external_plugins/).

Every plugin is configured in the same TOML configuration file, and you can
enable multiple instances of the same plugin.
For the complete list of available plugins, see the
[Plugin directory](/telegraf/v1/plugins/).

## Polling and service inputs

Most input plugins poll: on each collection interval, Telegraf calls the
plugin to gather current values, such as CPU usage or a database query result.

**Service input plugins** listen instead of polling.
They run continuously, receiving data pushed to them from sources such as
message queues (Kafka, MQTT, AMQP), socket listeners, and webhooks, and they
emit metrics into the pipeline as data arrives.

## Parsers and serializers

Many plugins move data in formats other than Telegraf metrics:

- **Parsers** convert raw input data, such as JSON, CSV, or Prometheus
  exposition format, into Telegraf metrics.
  Input plugins that support parsing accept a `data_format` option that
  selects one of the [input data formats](/telegraf/v1/data_formats/input/).
- **Serializers** convert Telegraf metrics into an output representation,
  such as InfluxDB line protocol, JSON, or Graphite.
  Output plugins that support serialization accept a `data_format` option
  that selects one of the
  [output data formats](/telegraf/v1/data_formats/output/).

## Learn more

{{< children >}}
