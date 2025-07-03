---
title: Manage buckets
seotitle: Manage buckets in InfluxDB Cloud Serverless
description: >
  Manage buckets in InfluxDB Cloud Serverless using the InfluxDB UI, influx CLI,
  or InfluxDB HTTP API.
menu:
  influxdb3_cloud_serverless:
    name: Manage buckets
    parent: Administer InfluxDB Cloud
weight: 105
influxdb3/cloud-serverless/tags: [buckets]
aliases:
  - /influxdb3/cloud-serverless/organizations/buckets/
  - /influxdb3/cloud-serverless/admin/databases/
alt_links:
  cloud: /influxdb/cloud/admin/buckets/
  cloud_dedicated: /influxdb3/cloud-dedicated/admin/databases/
  clustered: /influxdb3/clustered/admin/databases/
  v2: /influxdb/v2/admin/buckets/
---

A **bucket** is a named location where time series data is stored.
All buckets have a [retention period](#retention-period), a duration of time that each data point persists.
InfluxDB drops all points with timestamps older than the bucket's retention period.
A bucket belongs to an organization.

> [!Note]
> **If coming from InfluxDB v1**, the concepts of databases and retention policies
> have been combined into a single concept--_bucket_.
> Retention policies are no longer part of the InfluxDB data model.
> However, {{% product-name %}} does
> support InfluxQL and the InfluxDB v1 API `/write` and `/query` endpoints, which require databases and retention policies.
> See how to [map v1 databases and retention policies to buckets](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#map-v1-databases-and-retention-policies-to-buckets).
> 
> **If coming from InfluxDB v2 or InfluxDB Cloud**, _buckets_ are functionally equivalent.
> 
> **If coming from InfluxDB Cloud Dedicated or InfluxDB Clustered**, _database_ and _bucket_ are synonymous.

## Retention period

A bucket **retention period** is the maximum age of data stored in the bucket.
The age of data is determined by the timestamp associated with each point.
When a point's timestamp is beyond the retention period (relative to now), the
point is marked for deletion and is removed from the bucket the next time the
retention enforcement service runs.

The _minimum_ retention period for an InfluxDB bucket is 1 hour.
The _maximum_ retention period is infinite meaning data does not expire and will
never be removed by the retention enforcement service.

You can [update a bucket](#update-a-bucket) to change the retention period.

## Table and column limits

In {{< product-name >}}, table (measurement) and column are limited per bucket.
Each measurement is represented by a table.
Time, fields, and tags are each represented by a column.

**Maximum number of tables**: 500

**Maximum number of columns**: 200

The following articles provide information about managing buckets:

{{< children sort="weight">}}
