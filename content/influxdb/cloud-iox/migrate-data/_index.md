---
title: Migrate data to the InfluxDB IOx storage engine
description: >
  Migrate data from InfluxDB backed by TSM (OSS, Enterprise, or Cloud) to
  InfluxDB Cloud backed by InfluxDB IOx.
menu:
  influxdb_cloud_iox:
    name: Migrate data
weight: 9
---

Migrate data to InfluxDB from other InfluxDB instances including by InfluxDB OSS
and InfluxDB Cloud.

## Should you migrate?

There are important things to consider with migrating to InfluxDB Cloud backed by InfluxDB IOx.

- Do you want to use SQL to query your data? **Yes**
- Do you want better InfluxQL performance? **Yes**
- Do you have issues with high series cardinality or are looking for the ability to
  handle more series cardinality? **Yes**
- Are you heavily reliant on Flux tasks? **No**
- Do you rely on the InfluxDB Check and Notification system to send alerts? **No**
- Do you have requirements for cloud providers and regions? **Maybe**
  - InfluxDB Cloud instances backed by InfluxDB IOx are available in the following
    regions: 

#### Other things to note

- Flux queries are less performant against IOx.
  - `from()` vs `iox.from()`.
  - `iox.from()` and unpivot.

{{< children >}}
