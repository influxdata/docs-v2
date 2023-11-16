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
customized when [creating](#create-a-database) or
[updating a database](#update-a-database).

### Table limit

**Default maximum number of tables**: 500

Each measurement is represented by a table in a database.
Your database's table limit can be raised beyond the default limit of 500.
InfluxData has production examples of clusters with 20,000+ active tables across
multiple databases.

Increasing your table limit affects your {{% product-name omit=" Clustered" %}}
cluster in the following ways:

{{< expand-wrapper >}}
{{% expand "**May improve query performance** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

Schemas with many measurements that contain
focused sets of tags and fields can make it easier for the query engine to
identify what partitions contain the queried data, resulting in better
query performance.

{{% /expand %}}
{{% expand "**More PUTs into object storage** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

By default, {{< product-name >}} partitions
data by measurement and time range and stores each partition as a Parquet
file in your cluster's object store. By increasing the number of measurements
(tables) you can store in your database, you also increase the potential for
more `PUT` requests into your object store as InfluxDB creates more partitions.
Each `PUT` request incurs a monetary cost and will increase the operating cost of
your cluster.

{{% /expand %}}
{{% expand "**More work for the compactor** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

To optimize storage over time, your {{< product-name omit=" Clustered" >}}
cluster contains a compactor that routinely compacts Parquet files in object storage.
With more tables and partitions to compact, the compactor may need to be scaled
(either vertically or horizontally) to keep up with demand, adding to the
operating cost of your cluster.

{{% /expand %}}
{{< /expand-wrapper >}}

### Column limit

**Default maximum number of columns**: 250

Time, fields, and tags are each represented by a column in a table.
Increasing your column limit affects your {{% product-name omit=" Clustered" %}}
cluster in the following ways:

{{< expand-wrapper >}}
{{% expand "May adversely affect query performance" %}}

At query time, the InfluxDB query engine identifies what table contains the queried
data and then evaluates each row in the table to match the conditions of the query.
The more columns that are in each row, the longer it takes to evaluate each row.

Through performance testing, InfluxData has identified 250 columns as the
threshold where query performance may be affected
(depending on the shape of and data types in your schema).

{{% /expand %}}
{{< /expand-wrapper >}}

{{< children hlevel="h2" readmore=true hr=true >}}
