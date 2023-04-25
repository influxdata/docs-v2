---
title: Migrate data to the InfluxDB IOx storage engine
description: >
  Migrate data from InfluxDB backed by TSM (OSS, Enterprise, or Cloud) to
  InfluxDB Cloud backed by InfluxDB IOx.
menu:
  influxdb_cloud_serverless:
    name: Migrate data
    parent: Write data
weight: 104
alt_engine: /influxdb/cloud/migrate-data/
---

Migrate data to InfluxDB Cloud backed by InfluxDB IOx from other 
InfluxDB instances backed by TSM including InfluxDB OSS 1.x, 2.x,
InfluxDB Enterprise, and InfluxDB Cloud.

- [Should you migrate?](#should-you-migrate)
  - [Are you currently limited by series cardinality?](#are-you-currently-limited-by-series-cardinality)
  - [Do you want to use SQL to query your data?](#do-you-want-to-use-sql-to-query-your-data)
  <!-- - [Do you want better InfluxQL performance?](#do-you-want-better-influxql-performance) -->
  - [Do you depend on a specific cloud provider or region?](#do-you-depend-on-a-specific-cloud-provider-or-region)
  - [Are you reliant on Flux queries and Flux tasks?](#are-you-reliant-on-flux-queries-and-flux-tasks)
- [Data migration guides](#data-migration-guides)

## Should you migrate?

There are important things to consider with migrating to InfluxDB Cloud backed
by InfluxDB IOx. The following questions will help guide your decision to migrate.

#### Are you currently limited by series cardinality?

**Yes, you should migrate**. Series cardinality is a major limiting factor with
the InfluxDB TSM storage engine. The more unique series in your data, the less
performant your database.
The IOx storage engine supports near limitless series cardinality and is without
question, the better solution for high series cardinality workloads.

#### Do you want to use SQL to query your data?

**Yes, you should migrate**. InfluxDB {{< current-version >}} backed by InfluxDB
IOx lets you query your time series data with SQL. For more information about
querying your data with SQL, see:

- [Query data with SQL](/influxdb/cloud-serverless/query-data/sql/)
- [InfluxDB SQL reference](/influxdb/cloud-serverless/reference/sql/)

<!-- #### Do you want better InfluxQL performance?

**Yes, you should migrate**. One of the primary goals when designing the InfluxDB
IOx storage engine was to enable performant implementations of both SQL and InfluxQL.
When compared to querying InfluxDB backed by TSM (InfluxDB OSS 1.x, 2.x, and Enterprise),
InfluxQL queries are more performant when querying InfluxDB backed by InfluxDB IOx. -->

#### Do you depend on a specific cloud provider or region?

**You should maybe migrate**. InfluxDB Cloud instances backed by InfluxDB IOx
are available from the following providers:

{{< cloud_regions type=iox-list >}}

If your deployment requires other cloud providers or regions, you may need to
wait until the IOx storage engine is available in a region that meets your requirements.
We are currently working to make InfluxDB IOx available on more providers and
in more regions around the world.

#### Are you reliant on Flux queries and Flux tasks?

**You should maybe migrate**. Flux queries are less performant against the IOx
storage engine. Flux is optimized to work with the TSM storage engine, but these
optimizations do not apply to the on-disk structure of InfluxDB IOx.

To maintain performant Flux queries against the IOx storage engine, you need to
update Flux queries to use a mixture of both SQL and Flux—SQL to query the base
dataset and Flux to perform other transformations that SQL does not support.
For information about using SQL and Flux together for performant queries, see
[Use Flux and SQL to query data](/influxdb/cloud-serverless/query-data/flux-sql/).

---

## Data migration guides

{{< children >}}
