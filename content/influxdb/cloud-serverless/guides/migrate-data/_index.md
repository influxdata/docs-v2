---
title: Migrate data to InfluxDB Cloud Serverless
description: >
  Migrate data from InfluxDB powered by TSM (OSS, Enterprise, or Cloud) to
  InfluxDB Cloud Serverless.
menu:
  influxdb_cloud_serverless:
    name: Migrate data
    parent: Guides
weight: 104
alt_links:
  cloud: /influxdb/cloud/write-data/migrate-data/
aliases:
  - /influxdb/cloud-serverless/write-data/migrate-data/
  - /influxdb/cloud-serverless/reference/flux/
  - /influxdb/cloud-serverless/query-data/sql/execute-queries/flux-sql/
---

Migrate data to InfluxDB Cloud Serverless powered by the v3 storage engine from other
InfluxDB instances powered by TSM including InfluxDB OSS 1.x, 2.x,
InfluxDB Enterprise, and InfluxDB Cloud (TSM).

- [Should you migrate?](#should-you-migrate)
  - [Are you currently limited by series cardinality?](#are-you-currently-limited-by-series-cardinality)
  - [Do you want to use SQL to query your data?](#do-you-want-to-use-sql-to-query-your-data)
  <!-- - [Do you want better InfluxQL performance?](#do-you-want-better-influxql-performance) -->
  - [Do you depend on a specific cloud provider or region?](#do-you-depend-on-a-specific-cloud-provider-or-region)
  - [Are you reliant on Flux queries and Flux tasks?](#are-you-reliant-on-flux-queries-and-flux-tasks)
- [Data migration guides](#data-migration-guides)

## Should you migrate?

There are important things to consider with migrating to InfluxDB Cloud Serverless.
The following questions will help guide your decision to migrate.

#### Are you currently limited by series cardinality?

**Yes, you should migrate**. Series cardinality is a major limiting factor with
the InfluxDB TSM storage engine. The more unique series in your data, the less
performant your database.
The InfluxDB v3 storage engine supports near limitless series cardinality and is,
without question, the better solution for high series cardinality workloads.

#### Do you want to use SQL to query your data?

**Yes, you should migrate**. InfluxDB Cloud Serverless lets you query your time
series data with SQL. For more information about querying your data with SQL, see:

- [Query data with SQL](/influxdb/cloud-serverless/query-data/sql/)
- [InfluxDB SQL reference](/influxdb/cloud-serverless/reference/sql/)

<!-- #### Do you want better InfluxQL performance?

**Yes, you should migrate**. One of the primary goals when designing the InfluxDB
v3 storage engine was to enable performant implementations of both SQL and InfluxQL.
When compared to querying InfluxDB powered by TSM (InfluxDB OSS 1.x, 2.x, and Enterprise),
InfluxQL queries are more performant when querying InfluxDB powered by the v3 storage engine. -->

#### Do you depend on a specific cloud provider or region?

**You should maybe migrate**. InfluxDB Cloud Serverless instances are available
from the following providers:

{{< cloud_regions type=iox-list >}}

If your deployment requires other cloud providers or regions, you may need to wait
until the InfluxDB v3 storage engine is available in a region that meets your requirements.
We are currently working to make InfluxDB v3 available on more providers and
in more regions around the world.

#### Are you reliant on Flux queries and Flux tasks?

**You should maybe migrate**. Flux queries are less performant against the
InfluxDB v3 storage engine. Flux is optimized to work with the TSM storage engine,
but these optimizations do not apply to the on-disk structure of InfluxDB v3.

---

## Data migration guides

{{< children >}}
