---
title: Manage buckets
seotitle: Manage buckets in InfluxDB Cloud
description: Manage buckets in InfluxDB Cloud using the InfluxDB UI, influx CLI, or InfluxDB HTTP API.
menu:
  influxdb_cloud_iox:
    name: Manage buckets
    parent: Administer InfluxDB Cloud
weight: 105
influxdb/cloud-iox/tags: [buckets]
aliases:
  - /influxdb/cloud-iox/organizations/buckets/
---

A **bucket** is a named location where time series data is stored.
All buckets have a **retention period**, a duration of time that each data point persists.
InfluxDB drops all points with timestamps older than the bucket's retention period.
A bucket belongs to an organization.

The following articles provide information about managing buckets:

{{< children sort="weight">}}
