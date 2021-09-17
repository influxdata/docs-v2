---
title: Telegraf plugins
description: >
  Telegraf is a plugin-driven agent that collects, processes, aggregates, and writes metrics.
  It supports four categories of plugins including input, output, aggregator, and processor.
  View and search all available Telegraf plugins.
menu:
  telegraf_1_20:
    weight: 40
weight: 6
aliases:
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
- [External plugins](#external-plugins)

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

## External plugins
External plugins are external programs that are built outside of Telegraf that can run through an `execd` plugin.

{{< telegraf/plugins type="external" >}}
