---
title: Use Telegraf to write data
seotitle: Use the Telegraf agent to collect and write data
list_title: Use the Telegraf agent
weight: 101
description: >
  Use Telegraf to collect and write data to InfluxDB v2.0.
  Create Telegraf configurations in the InfluxDB UI or manually configure Telegraf.
aliases:
  - /influxdb/v2.0/collect-data/advanced-telegraf
  - /influxdb/v2.0/collect-data/use-telegraf
  - /influxdb/v2.0/write-data/use-telegraf/
menu:
  influxdb_2_0:
    name: Telegraf (agent)
    parent: No-code solutions
---

[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) is InfluxData's
data collection agent for collecting and reporting metrics.
Its vast library of input plugins and "plug-and-play" architecture lets you quickly
and easily collect metrics from many different sources.
This article describes how to use Telegraf to collect and store data in InfluxDB v2.0.

For a list of available plugins, see [Telegraf plugins](/{{< latest "telegraf" >}}/plugins//).

#### Requirements
- **Telegraf 1.9.2 or greater**.
  _For information about installing Telegraf, see the
  [Telegraf Installation instructions](/{{< latest "telegraf" >}}/introduction/installation/)._

## Configure Telegraf
Telegraf input and output plugins are enabled and configured in Telegraf's configuration file (`telegraf.conf`).
You have the following options for configuring Telegraf:

{{< children >}}
