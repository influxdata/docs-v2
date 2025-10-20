---
title: Monitor the InfluxData Platform
description: Use InfluxDB to monitor your stack's health and identify issues before they impact operations.
menu:
  platform:
    name: Monitor the InfluxData Platform
    identifier: monitor-platform
    weight: 1
    parent: Monitor
---

Monitoring your stack's health is essential for identifying and addressing issues before they impact operations.
The InfluxData Platform is built to collect, process, transform, and store event and time series data, making it well-suited for server and infrastructure monitoring.

## Monitor with InfluxDB 3

InfluxDB 3 delivers high-performance time series data management at scale with SQL and
InfluxQL querying and built-in data processing capabilities.

- Collect and label metrics with [Telegraf](/telegraf/v1/) and send them to your InfluxDB 3 instance
- Store and query metrics using [InfluxDB 3 Core](/influxdb3/core/) or [InfluxDB 3 Enterprise](/influxdb3/enterprise/)
- Process and analyze data directly in the database with the built-in Python processing engine—use and extend pre-built plugins to run analysis, generate alerts, and send notifications in real-time, on-demand, or on a schedule:
  - [Use and extend plugins for InfluxDB 3 Core](/influxdb3/core/process-data/python/plugins/)
  - [Use and extend plugins for InfluxDB 3 Enterprise](/influxdb3/enterprise/process-data/python/plugins/)
- Visualize metrics and explore your data with [InfluxDB 3 Explorer](/influxdb3/explorer/)

## Monitor with other InfluxDB versions

### InfluxDB 2.x

See [Monitor InfluxDB 2.0](/influxdb/v2/monitor-alert/) for monitoring strategies specific to InfluxDB 2.x.

### InfluxDB Enterprise v1

See [Monitor InfluxDB Enterprise](/enterprise_influxdb/v1/administration/monitor/) for Enterprise v1 monitoring documentation.

### InfluxDB v1.x (TICK stack)

The following pages provide monitoring strategies, visualizations, and alerting approaches using the TICK stack:

{{< children >}}
