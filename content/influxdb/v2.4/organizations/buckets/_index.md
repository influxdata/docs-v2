---
title: Manage buckets
seotitle: Manage buckets in InfluxDB
description: Manage buckets in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_2_4:
    name: Manage buckets
    parent: Manage organizations
weight: 105
influxdb/v2.4/tags: [buckets]
---

A **bucket** is a named location where time series data is stored.
All buckets have a **retention period**, a duration of time that each data point persists.
InfluxDB drops all points with timestamps older than the bucket's retention period.
A bucket belongs to an organization.

The following articles provide information about managing buckets:

{{< children >}}
