---
title: Manage databases
seotitle: Manage databases in InfluxDB Cloud Dedicated
description: >
  Manage databases in your InfluxDB Cloud Dedicated cluster.
  A database is a named location where time series data is stored.
  Each InfluxDB database has a retention period, which defines the maximum age
  of data stored in the database.
menu:
  influxdb3_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 101
influxdb3/cloud-dedicated/tags: [databases]
related:
  - /influxdb3/cloud-dedicated/write-data/best-practices/schema-design/
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/
alt_links:
  cloud: /influxdb/cloud/admin/buckets/
  cloud-serverless: /influxdb3/cloud-serverless/admin/buckets/
  clustered: /influxdb3/cloud-dedicated/admin/databases/
  v2: /influxdb/v2/admin/buckets/
---

An InfluxDB database is a named location where time series data is stored.
Each InfluxDB database has a [retention period](#retention-periods).

> [!Note]
> **If coming from InfluxDB v1**, the concepts of databases and retention policies
> have been combined into a single concept--database. Retention policies are no
> longer part of the InfluxDB data model.
> However, {{% product-name %}} does
> support InfluxQL, which requires databases and retention policies.
> See [InfluxQL DBRP naming convention](/influxdb3/cloud-dedicated/admin/databases/create/#influxql-dbrp-naming-convention).
> 
> **If coming from InfluxDB v2, InfluxDB Cloud (TSM), or InfluxDB Cloud Serverless**,
> _database_ and _bucket_ are synonymous.

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

You can customize [table (measurement) limits](#table-limit) and
[table column limits](#column-limit) when you
[create](#create-a-database) or
[update a database](#update-a-database) in {{% product-name %}}.

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
[focused sets of tags and fields](/influxdb3/cloud-dedicated/write-data/best-practices/schema-design/#design-for-performance)
can make it easier for the query engine to
identify what partitions contain the queried data, resulting in better
query performance.

{{% /expand %}}
{{% expand "**More PUTs into object storage** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

By default, {{< product-name >}} partitions
data by measurement and time range and stores each partition as a Parquet
file in your cluster's object store. By increasing the number of measurements
(tables) you can store in your database, you also increase the potential for
more `PUT` requests into your object store as InfluxDB creates more partitions.
Each `PUT` request incurs a monetary cost and increases the operating cost of
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

**Configurable maximum number of columns**: 1000

Each row must include a time column, with the remaining columns representing
tags and fields.
As a result, a table with 250 columns can have one time column and up to
249 field and tag columns.

If you attempt to write to a table and exceed the column limit, the write
request fails and InfluxDB returns an error.

If you update the column limit for a database, the limit applies to newly
created tables; doesn't override the column limit for existing tables.

Increasing your column limit affects your {{% product-name omit=" Clustered" %}}
cluster in the following ways:

{{< expand-wrapper >}}
{{% expand "May adversely affect system performance" %}}

When creating or updating a database, you can configure the table column limit to be
lower than the default or up to 1000, based on your requirements.
InfluxData identified 250 columns as the safe limit for maintaining system
performance and stability.
Exceeding this threshold can result in
[wide schemas](/influxdb3/cloud-dedicated/write-data/best-practices/schema-design/#avoid-wide-schemas),
which can negatively impact performance and resource use,
depending on your queries, the shape of your schema, and data types in the schema.

{{% /expand %}}
{{< /expand-wrapper >}}

{{< children hlevel="h2" readmore=true hr=true >}}
