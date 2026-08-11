---
title: Telegraf documentation
description: >
  Documentation for Telegraf, the plugin-driven server agent for collecting,
  processing, and writing metrics and events.
  Telegraf supports four categories of plugins: input, output, aggregator,
  and processor.
menu:
  telegraf_v1:
    name: Telegraf
  telegraf_enterprise:
    name: Telegraf
    weight: 10
weight: 1
related:
  - /resources/videos/intro-to-telegraf/
  - /telegraf/v1/install/
  - /telegraf/v1/get-started/
  - /telegraf/v1/concepts/
cascade:
  product: telegraf
  version: v1
---

Telegraf is a plugin-driven server agent for collecting, processing, and
writing metrics and events.
Written in Go, Telegraf compiles into a single binary with no external
dependencies and requires minimal memory.

Telegraf moves data through a configurable pipeline:

- **Input plugins** collect metrics from systems, services, databases, and
  IoT sensors.
- **Processor plugins** transform and filter metrics as they pass through the
  pipeline.
- **Aggregator plugins** create aggregate metrics, such as running means,
  minimums, and maximums, over configurable periods.
- **Output plugins** write metrics to InfluxDB and other destinations.

To learn how metrics move through the pipeline, see
[How Telegraf works](/telegraf/v1/concepts/).

## Key capabilities

- **300+ plugins**: collect from and write to databases, message queues, cloud
  services, and IoT devices.
  Browse the [Plugin directory](/telegraf/v1/plugins/).
- **Parsers and serializers**: read and write many
  [input](/telegraf/v1/data_formats/input/) and
  [output](/telegraf/v1/data_formats/output/) data formats, including JSON,
  CSV, Prometheus, and InfluxDB line protocol.
- **Metric filtering**: select and modify metrics at each stage of the
  pipeline with [metric filtering](/telegraf/v1/configuration/#metric-filtering).
- **Buffering and delivery**: buffer metrics in memory or on disk and retry
  failed writes.
- **Secret stores**: keep credentials out of plain-text configuration files
  with [secret store plugins](/telegraf/v1/secretstore-plugins/).
- **Manage agents at scale**: use [Telegraf Controller](/telegraf/controller/)
  to centrally manage configurations and monitor Telegraf agents across your
  infrastructure.

## Get started

1. [Install Telegraf](/telegraf/v1/install/)
2. [Get started with Telegraf](/telegraf/v1/get-started/)

For an introduction to Telegraf and an overview of how it works, watch the
following video:

{{< youtube vGJeo3FaMds >}}

{{< influxdbu title="Telegraf Basics" summary="Learn how to get started with Telegraf with this **free** course that covers common use cases, proper configuration, and best practices for deployment. Also, discover how to write your own custom Telegraf plugins." action="Take the course" link="https://university.influxdata.com/courses/telegraf-basics-tutorial/" >}}

{{< influxdbu "telegraf-102" >}}
