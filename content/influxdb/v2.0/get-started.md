---
title: Get started with InfluxDB
description: >
Start collecting, processing, and visualizing data in InfluxDB OSS.
menu:
  influxdb_2_0:
    name: Get started
weight: 2
influxdb/v2.0/tags: [get-started]
aliases:
  - /influxdb/v2.0/introduction/get-started/
---

After you've [signed up for InfluxDB OSS](/influxdb/v2.0/sign-up/), you're ready to start writing, querying, and visualizing data.

### Collect and write data

Collect and write data to InfluxDB using the Telegraf plugins, the InfluxDB v2 API, the `influx` command line interface (CLI), the InfluxDB UI (the user interface for InfluxDB 2.0), or the InfluxDB v2 API client libraries.

#### Use Telegraf

Use Telegraf to quickly write data to {{< cloud-name >}}.
Create new Telegraf configurations automatically in the InfluxDB UI, or manually update an existing Telegraf configuration to send data to your {{< cloud-name "short" >}} instance.

For details, see [Automatically configure Telegraf](/influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/)
and [Manually update Telegraf configurations](/influxdb/v2.0/write-data/no-code/use-telegraf/manual-config/).

#### Scrape data

**InfluxDB OSS** lets you scrape Prometheus-formatted metrics from HTTP endpoints. For details, see [Scrape data](/influxdb/v2.0/write-data/no-code/scrape-data/).

#### API, CLI, and client libraries

For information about using the InfluxDB v2 API, `influx` CLI, and client libraries to write data, see [Write data to InfluxDB](/influxdb/v2.0/write-data/).

### Query data

Query data using Flux, the UI, and the `influx` command line interface.
See [Query data](/influxdb/v2.0/query-data/).

### Process data

Use InfluxDB tasks to process and downsample data. See [Process data](/influxdb/v2.0/process-data/).

### Visualize data

Build custom dashboards to visualize your data.
See [Visualize data](/influxdb/v2.0/visualize-data/).

### Monitor and alert

Monitor your data and sends alerts based on specified logic.
See [Monitor and alert](/influxdb/v2.0/monitor-alert/).
