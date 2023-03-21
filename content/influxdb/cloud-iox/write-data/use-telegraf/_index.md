---
title: Use Telegraf to write data
seotitle: Use the Telegraf agent to collect and write data
weight: 101
description: >
  Use Telegraf to collect and write data to InfluxDB.
  Create Telegraf configurations in the InfluxDB UI or manually configure Telegraf.
aliases:
  - /influxdb/cloud-iox/collect-data/advanced-telegraf
  - /influxdb/cloud-iox/collect-data/use-telegraf
  - /influxdb/cloud-iox/write-data/use-telegraf/
  - /influxdb/cloud-iox/write-data/no-code/use-telegraf/
menu:
  influxdb_cloud_iox:
    name: Use Telegraf
    parent: Write data
---

[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) is InfluxData's
data collection agent for collecting and reporting metrics.
Its vast library of input plugins and "plug-and-play" architecture lets you quickly
and easily collect metrics from many different sources.

For a list of available plugins, see [Telegraf plugins](/{{< latest "telegraf" >}}/plugins/).

#### Requirements

- **Telegraf 1.9.2 or greater**.
  _For information about installing Telegraf, see the
  [Telegraf Installation instructions](/{{< latest "telegraf" >}}//install/)._

## Basic Telegraf usage

Telegraf is a plugin-based agent with plugins are that enabled and configured in
your Telegraf configuration file (`telegraf.conf`).
Each Telegraf configuration must **have at least one input plugin and one output plugin**.

Telegraf input plugins retrieve metrics from different sources.
Telegraf output plugins write those metrics to a destination.

Use the `outputs.influxdb_v2` plugin to write metrics collected by Telegraf to InfluxDB.

```toml
# ...

[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```

_For more information, see [Manually configure Telegraf](/influxdb/cloud-iox/write-data/use-telegraf/configure/manual-config/#enable-and-configure-the-influxdb-v2-output-plugin)._

## Use Telegraf with InfluxDB

{{< children >}}

{{< influxdbu "telegraf-102" >}}
