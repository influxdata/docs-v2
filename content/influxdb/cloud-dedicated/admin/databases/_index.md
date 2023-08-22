---
title: Manage databases
seotitle: Manage databases in InfluxDB Cloud Dedicated
description: >
  Manage databases in your InfluxDB Cloud Dedicated cluster.
  A database is a named location where time series data is stored.
  Each InfluxDB database has a retention period, which defines the maximum age
  of data stored in the database.
menu:
  influxdb_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 101
influxdb/cloud-dedicated/tags: [databases]
---

An InfluxDB database is a named location where time series data is stored.
Each InfluxDB database has a [retention period](#retention-periods).

{{% note %}}
**If coming from InfluxDB v1**, the concepts of databases and retention policies
have been combined into a single concept--database. Retention policies are no
longer part of the InfluxDB data model. However, InfluxDB Cloud Dedicated does
support InfluxQL, which requires databases and retention policies.
See [InfluxQL DBRP naming convention](/influxdb/cloud-dedicated/admin/databases/create/#influxql-dbrp-naming-convention).

**If coming from InfluxDB v2 or InfluxDB Cloud**, _database_ and _bucket_ are synonymous.
{{% /note %}}

## Retention periods

A database **retention period** is the maximum age of data stored in the database.
The age of data is determined by the timestamp associated with each point.
When a point's timestamp is beyond the retention period (relative to now), the
point is marked for deletion and is removed from the database the next time the
retention enforcement service runs.

The _minimum_ retention period for and InfluxDB database is 1 hour.
The _maximum_ retention period is infinite meaning data does not expire and will
never be removed by the retention enforcement service.

## Table and column limits

In {{< product-name >}}, table (measurement) and column limits can be
custom configured when [creating](#create-a-database) or
[updating a database](#update-a-database).
Each measurement is represented by a table.
Time, fields, and tags are each represented by a column.

**Default maximum number of tables**: 500  
**Default maximum number of columns**: 250

{{% warn %}}
Setting table and column limits above the default limits may adversely affect
database performance.
{{% /warn %}}

---

{{< children hlevel="h2" readmore=true hr=true >}}
