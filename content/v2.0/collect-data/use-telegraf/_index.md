---
title: Use Telegraf to collect data
weight: 102
seotitle: Use Telegraf to collect and write data
description: >
  Use Telegraf to collect and write data to InfluxDB v2.0.
  Create Telegraf configurations in the InfluxDB UI or manually configure Telegraf.
aliases:
  - /v2.0/collect-data/advanced-telegraf
menu:
  v2_0:
    name : Use Telegraf
    parent: Collect data

---

[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) is InfluxData's
data collection agent for collecting and reporting metrics.
Its vast library of input plugins and "plug-and-play" architecture lets you quickly
and easily collect metrics from many different sources.
This article describes how to use Telegraf to collect and store data in InfluxDB v2.0.

#### Requirements
- **Telegraf 1.9.2 or greater**.
  _For information about installing Telegraf, see the
  [Telegraf Installation instructions](https://docs.influxdata.com/telegraf/latest/introduction/installation/)._

## Configure Telegraf
All Telegraf input and output plugins are enabled and configured in Telegraf's configuration file (`telegraf.conf`).
You have the following options for configuring Telegraf:

{{< children >}}
