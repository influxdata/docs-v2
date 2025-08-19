---
title: Use Telegraf to write data
seotitle: Use the Telegraf agent to collect and write data
weight: 101
description: >
  Use Telegraf to collect and write data to InfluxDB.
  Create Telegraf configurations in the InfluxDB UI or manually configure Telegraf.
aliases:
  - /influxdb3/clustered/collect-data/advanced-telegraf
  - /influxdb3/clustered/collect-data/use-telegraf
  - /influxdb3/clustered/write-data/no-code/use-telegraf/
menu:
  influxdb3_clustered:
    name: Use Telegraf
    parent: Write data
alt_links:
  cloud: /influxdb/cloud/write-data/no-code/use-telegraf/
---

[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) is a
no-code data collection agent for collecting and reporting metrics.
Its vast library of input plugins and "plug-and-play" architecture lets you quickly
and easily collect metrics from many different sources.

For a list of available plugins, see [Telegraf plugins](/telegraf/v1/plugins/).

#### Requirements

- **Telegraf 1.9.2 or greater**.
  _For information about installing Telegraf, see the
  [Telegraf Installation instructions](/telegraf/v1/install/)._

## Basic Telegraf usage

Telegraf is a plugin-based agent with plugins that are enabled and configured in
your Telegraf configuration file (`telegraf.conf`).
Each Telegraf configuration must **have at least one input plugin and one output plugin**.

Telegraf input plugins retrieve metrics from different sources.
Telegraf output plugins write those metrics to a destination.

Use the [`outputs.influxdb_v2`](/telegraf/v1/plugins/#output-influxdb_v2) plugin to write metrics collected by Telegraf to {{% product-name %}}.

```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["https://{{< influxdb/host >}}"]
  token = "${INFLUX_TOKEN}"
  organization = ""
  bucket = "DATABASE_NAME"

# ...
```

_See how to [Configure Telegraf](/influxdb3/clustered/write-data/use-telegraf/configure/)._

## Use Telegraf with InfluxDB

{{< children >}}

{{< influxdbu "telegraf-102" >}}
