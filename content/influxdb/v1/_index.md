---
title: InfluxDB OSS v1 documentation
description: Overview of documentation available for InfluxDB.
menu:
  influxdb_v1:
    name: InfluxDB OSS v1
weight: 1
---

InfluxDB is a [time series database](https://www.influxdata.com/time-series-database/) designed to handle high write and query loads.
InfluxDB OSS v1 is purpose-built to handle any use case involving large amounts
of timestamped data and is an integral component of the
[TICK stack](https://influxdata.com/time-series-platform/).

Common use cases include:

- Infrastructure and DevOps monitoring
- Application metrics and performance monitoring
- IoT sensor data collection
- Real-time analytics
- Events handling

{{< influxdb/cloud1-note type="oss" >}}

## Key features

InfluxDB v{{< current-version >}} supports the following features for working with time series data.

- Custom high performance datastore written specifically for time series data.
The TSM engine allows for high ingest speed and data compression
- Written entirely in Go.
It compiles into a single binary with no external dependencies.
- Simple, high performing write and query HTTP APIs.
- Plugins support for other data ingestion protocols such as Graphite, collectd, and OpenTSDB.
- Expressive SQL-like query language tailored to easily query aggregated data.
- Tags allow series to be indexed for fast and efficient queries.
- Retention policies efficiently auto-expire stale data.
- Continuous queries automatically compute aggregate data to make frequent queries more efficient.

InfluxDB OSS v1 runs on a single node.
If you require high availability to eliminate a single point of failure, consider [InfluxDB 3 Enterprise](/influxdb3/enterprise/),
InfluxDB's next generation that supports multi-node clustering, allows infinite series cardinality without impact on overall database performance, and
brings native SQL support and improved InfluxQL performance.
