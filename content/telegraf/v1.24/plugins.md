---
title: Plugin directory
description: >
  Telegraf is a plugin-driven agent that collects, processes, aggregates, and writes metrics.
  It supports four categories of plugins including input, output, aggregator, and processor.
  View and search all available Telegraf plugins.
menu:
  telegraf_1_24_ref:

    weight: 10
weight: 6
aliases:
  - /telegraf/v1.24/plugins/processors/
  - /telegraf/v1.24/plugins/plugins-list/
  - /telegraf/v1.24/plugins/aggregators/
  - /telegraf/v1.24/plugins/outputs/
  - /telegraf/v1.24/plugins/inputs/
  - /telegraf/v1.23/plugins/plugins-list/
  - /telegraf/v1.23/plugins/aggregators/
  - /telegraf/v1.23/plugins/inputs/
  - /telegraf/v1.23/plugins/outputs/
  - /telegraf/v1.23/plugins/processors/
  - /telegraf/v1.22/plugins/plugins-list/
  - /telegraf/v1.22/plugins/aggregators/
  - /telegraf/v1.22/plugins/inputs/
  - /telegraf/v1.22/plugins/outputs/
  - /telegraf/v1.22/plugins/processors/
  - /telegraf/v1.21/plugins/plugins-list/
  - /telegraf/v1.21/plugins/aggregators/
  - /telegraf/v1.21/plugins/inputs/
  - /telegraf/v1.21/plugins/outputs/
  - /telegraf/v1.21/plugins/processors/
  - /telegraf/v1.20/plugins/plugins-list/
  - /telegraf/v1.20/plugins/aggregators/
  - /telegraf/v1.20/plugins/inputs/
  - /telegraf/v1.20/plugins/outputs/
  - /telegraf/v1.20/plugins/processors/
  - /telegraf/v1.19/plugins/plugins-list/
  - /telegraf/v1.19/plugins/aggregators/
  - /telegraf/v1.19/plugins/inputs/
  - /telegraf/v1.19/plugins/outputs/
  - /telegraf/v1.19/plugins/processors/
  - /telegraf/v1.18/plugins/plugins-list/
  - /telegraf/v1.18/plugins/aggregators/
  - /telegraf/v1.18/plugins/inputs/
  - /telegraf/v1.18/plugins/outputs/
  - /telegraf/v1.18/plugins/processors/
  - /telegraf/v1.17/plugins/plugins-list/
  - /telegraf/v1.17/plugins/aggregators/
  - /telegraf/v1.17/plugins/inputs/
  - /telegraf/v1.17/plugins/outputs/
  - /telegraf/v1.17/plugins/processors/
---

Telegraf is a plugin-driven agent that collects, processes, aggregates, and writes metrics.
It supports four categories of plugins including input, output, aggregator, processor, and external.

{{< list-filters >}}

**Jump to:**

- [Input plugins](#input-plugins)
- [Output plugins](#output-plugins)
- [Aggregator plugins](#aggregator-plugins)
- [Processor plugins](#processor-plugins)

## Input plugins
Telegraf input plugins are used with the InfluxData time series platform to collect
metrics from the system, services, or third-party APIs.

{{< telegraf/plugins type="input" >}}

## Output plugins
Telegraf processor plugins write metrics to various destinations.

{{< telegraf/plugins type="output" >}}

## Aggregator plugins
Telegraf aggregator plugins create aggregate metrics (for example, mean, min, max, quantiles, etc.)

{{< telegraf/plugins type="aggregator" >}}

## Processor plugins
Telegraf output plugins transform, decorate, and filter metrics.

{{< telegraf/plugins type="processor" >}}
