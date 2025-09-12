---
title: Plugin directory
description: >
  Telegraf is a plugin-driven agent that collects, processes, aggregates, and writes metrics.
  It supports four categories of plugins including input, output, aggregator, and processor.
  View and search all available Telegraf plugins.
menu:
  telegraf_v1_ref:
    identifier: plugins_reference
    weight: 10
weight: 6
aliases:
  - /telegraf/v1/plugins/aggregators/
  - /telegraf/v1/plugins/inputs/
  - /telegraf/v1/plugins/outputs/
  - /telegraf/v1/plugins/plugin-list/
  - /telegraf/v1/plugins/plugins-list/
  - /telegraf/v1/plugins/processors/
---

Telegraf is a plugin-driven agent that collects, processes, aggregates, and writes metrics.
It supports four categories of plugins: input, output, aggregator, and processor.
In addition to the included plugins, you can run _external plugins_
that integrate with the Telegraf Execd processor plugin.

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
