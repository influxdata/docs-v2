---
title: Telegraf plugins
description: >
  Telegraf is a plugin-driven agent that collects, processes, aggregates, and writes metrics.
  It supports four categories of plugins including input, output, aggregator, and processor.
  View and search all available Telegraf plugins.
menu: influxdb_2_0_ref
weight: 6
aliases:
  - /v2.0/reference/telegraf-plugins/
---

Telegraf is a plugin-driven agent that collects, processes, aggregates, and writes metrics.
It supports four categories of plugins including input, output, aggregator, and processor.

- [Input plugins](#input-plugins)
- [Output plugins](#output-plugins)
- [Aggregator plugins](#aggregator-plugins)
- [Processor plugins](#processor-plugins)

{{< telegraf/filters >}}

## Input plugins
Telegraf input plugins are used with the InfluxData time series platform to collect
metrics from the system, services, or third party APIs.

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
