---
title: Process Data with InfluxDB tasks
seotitle: Process Data with InfluxDB tasks
description: placeholder
menu:
  v2_0:
    name: Process data
    weight: 3
---

InfluxDB's _**task engine**_ is designed for processing and analyzing data.
A task is a scheduled Flux query that take a stream of input data, modify or
analyze it in some way, then perform an action.
Examples include data downsampling, anomaly detection _(Coming)_, alerting _(Coming)_, etc.

{{% note %}}
Tasks are a replacement for InfluxDB v1.x's continuous queries.
{{% /note %}}

The following articles explain how to configure and build tasks using the InfluxDB user interface (UI)
and via raw Flux scripts with the `influx` command line interface (CLI).
They also provide examples of commonly used tasks.

_Links for nested docs._
