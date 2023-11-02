---
title: Manage buckets
seotitle: Manage buckets in InfluxDB
description: Manage buckets in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_cloud:
    name: Manage buckets
    parent: Administer InfluxDB Cloud
weight: 11
influxdb/cloud/tags: [buckets]
aliases:
  - /influxdb/cloud/organizations/buckets/
alt_links:
  cloud-serverless: /influxdb/cloud-serverless/admin/buckets/
  cloud-dedicated: /influxdb/cloud-dedicated/admin/databases/
  clustered: /influxdb/clustered/admin/databases/
---

A **bucket** is a named location where time series data is stored.
All buckets have a **retention period**, a duration of time that each data point persists.
InfluxDB drops all points with timestamps older than the bucket's retention period.
A bucket belongs to an organization.

The following articles provide information about managing buckets:

{{< children sort="weight">}}
