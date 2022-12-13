---
title: Manage the InfluxDB time series index (TSI)
description: >
  The InfluxDB [time series index (TSI)](/influxdb/v2.6/reference/internals/storage-engine/#time-series-index-tsi)
  indexes or caches measurement and tag data to ensure queries are performant.
  Use the `influxd inspect` command to manage the TSI index.
menu:
  influxdb_2_5:
    name: Manage TSI indexes
    parent: Manage internal systems
weight: 101
---

The InfluxDB [time series index (TSI)](/influxdb/v2.6/reference/internals/storage-engine/#time-series-index-tsi)
indexes or caches measurement and tag data to ensure queries are performant.

{{< children >}}
