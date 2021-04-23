---
title: InfluxDB Enterprise 1.9 documentation
description: >
  Documentation for InfluxDB Enterprise, which adds clustering, high availability, fine-grained authorization, and more to InfluxDB OSS.
aliases:
    - /enterprise/v1.9/
menu:
  enterprise_influxdb_1_9:
    name: InfluxDB Enterprise v1.9
weight: 1
---

InfluxDB Enterprise provides a time series database designed to handle high write and query loads and offers highly scalable clusters on your infrastructure with a management UI. Use for DevOps monitoring, IoT sensor data, and real-time analytics. Check out the key features that make InfluxDB Enterprise a great choice for working with time series data.

If you're interested in working with InfluxDB Enterprise, visit
[InfluxPortal](https://portal.influxdata.com/) to sign up, get a license key,
and get started!

## Key features

- Custom high performance datastore written specifically for time series data. High ingest speed and data compression.
- Provides high availability across your cluster and eliminates a single point of failure
- Written entirely in Go. Compiles into a single binary with no external dependencies.
- Simple, high performing write and query HTTP APIs.
- Plugin support for other data ingestion protocols such as Graphite, collectd, and OpenTSDB.
- Expressive SQL-like query language tailored to easily query aggregated data.
- Continuous queries automatically compute aggregate data to make frequent queries more efficient.
- Tags allow series to be indexed for fast and efficient queries.
- Retention policies efficiently auto-expire stale data.

## Next steps

- Install and deploy
- Review key [concepts](/enterprise_influxdb/v1.9/concepts/)
- [Get started](/enterprise_influxdb/v1.9/introduction/getting-started/)

<!--- Monitor your cluster
- Manage queries
- Manage users
- Explore and visualize your data
-->