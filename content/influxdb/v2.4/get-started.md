---
title: Get started with InfluxDB
description: >
  Start collecting, processing, and visualizing data in InfluxDB OSS.
menu:
  influxdb_2_4:
    name: Get started
weight: 3
influxdb/v2.4/tags: [get-started]
aliases:
  - /influxdb/v2.4/introduction/get-started/
metadata: [1 / 4]
---

InfluxDB 2.4 is the platform purpose-built to collect, store, process and visualize time series data.
**Time series data** is a sequence of data points indexed in time order.
Data points typically consist of successive measurements made from the same
source and are used to track changes over time.
Examples of time series data include:

- Industrial sensor data
- Server performance metrics
- Heartbeats per minute
- Electrical activity in the brain
- Rainfall measurements
- Stock prices

This multi-part tutorial walks through writing time series data to InfluxDB,
querying that data, processing and alerting on the data, and then visualizing the data.

## Key concepts before you get started

- Key concepts
  - Data model / InfluxDB elements
    - Measurement
      - Data stored in a measurement should all have the same schema (tag set)
    - Tags
    - Fields
    - Series


---

- Set up
  - Download and install InfluxDB
  - Download, install, and configure the `influx` CLI

- Write data
  - Intro to line protocol
  - Other methods for writing data (Telegraf, Client libraries, scrapers, etc.)
  - Write some example line protocol
  - Use the InfluxDB CLI, UI, or API to write the example line protocol

- Query data
  - Intro to Flux and InfluxQL
  - Annotated CSV
  - Walk through creating a Flux query
    - `from()`
    - `range()` (InfluxDB doesn't support unbounded queries)
    - `filter()`
    - Other operations you can perform
  - Use the InfluxDB CLI, UI, or API to query data

- Process data
  - Intro to the InfluxDB tasks engine
  - Downsample data
  - Monitor and alert on data

- Visualize data
  - Dashboards
  - Data explorer
  - 

<!-- After you've [installed InfluxDB OSS](/influxdb/v2.4/install/), you're ready to get started. Explore the following ways to work with your data:

- [Collect and write data](#collect-and-write-data)
- [Query data](#query-data)
- [Process data](#process-data)
- [Visualize data](#visualize-data)
- [Monitor and alert](#monitor-and-alert)

*Note:** To run InfluxDB, start the `influxd` daemon ([InfluxDB service](/influxdb/v2.4/reference/cli/influxd/)) using the [InfluxDB command line interface](/influxdb/v2.4/reference/cli/influx/). Once you've started the `influxd` daemon, use `localhost:8086` to log in to your InfluxDB instance.

To start InfluxDB, do the following:
  1. Open a terminal.
  2. Type `influxd` in the command line.

```sh
influxd
```

### Collect and write data

Collect and write data to InfluxDB using the Telegraf plugins, the InfluxDB v2 API, the `influx` command line interface (CLI), the InfluxDB UI (the user interface for InfluxDB 2.4), or the InfluxDB v2 API client libraries.

#### Use Telegraf

Use Telegraf to quickly write data to {{< cloud-name >}}.
Create new Telegraf configurations automatically in the InfluxDB UI, or manually update an existing Telegraf configuration to send data to your {{< cloud-name "short" >}} instance.

For details, see [Automatically configure Telegraf](/influxdb/v2.4/write-data/no-code/use-telegraf/auto-config/)
and [Manually update Telegraf configurations](/influxdb/v2.4/write-data/no-code/use-telegraf/manual-config/).

#### Scrape data

**InfluxDB OSS** lets you scrape Prometheus-formatted metrics from HTTP endpoints. For details, see [Scrape data](/influxdb/v2.4/write-data/no-code/scrape-data/).

#### API, CLI, and client libraries

For information about using the InfluxDB v2 API, `influx` CLI, and client libraries to write data, see [Write data to InfluxDB](/influxdb/v2.4/write-data/).

### Query data

Query data using Flux, the UI, and the `influx` command line interface.
See [Query data](/influxdb/v2.4/query-data/).

### Process data

Use InfluxDB tasks to process and downsample data. See [Process data](/influxdb/v2.4/process-data/).

### Visualize data

Build custom dashboards to visualize your data.
See [Visualize data](/influxdb/v2.4/visualize-data/).

### Monitor and alert

Monitor your data and sends alerts based on specified logic.
See [Monitor and alert](/influxdb/v2.4/monitor-alert/). -->

{{< influxdbu "influxdb-101" >}}
