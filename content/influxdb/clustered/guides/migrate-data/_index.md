---
title: Migrate data to InfluxDB Clustered
description: >
  Migrate data from InfluxDB powered by TSM (OSS, Enterprise, or Cloud) to
  InfluxDB Clustered.
menu:
  influxdb_clustered:
    name: Migrate data
    parent: Guides
weight: 104
alt_links:
  cloud: /influxdb/cloud/write-data/migrate-data/
---

Migrate data to InfluxDB Clustered powered by InfluxDB v3 from other 
InfluxDB instances powered by TSM including InfluxDB OSS 1.x, 2.x,
InfluxDB Enterprise, and InfluxDB Cloud (TSM).

- [Should you migrate?](#should-you-migrate)
  - [Are you currently limited by series cardinality?](#are-you-currently-limited-by-series-cardinality)
  - [Do you want to use SQL to query your data?](#do-you-want-to-use-sql-to-query-your-data)
  - [Do you want better InfluxQL performance?](#do-you-want-better-influxql-performance)
  - [Do you depend on a specific cloud provider or region?](#do-you-depend-on-a-specific-cloud-provider-or-region)
  - [Are you reliant on Flux queries and Flux tasks?](#are-you-reliant-on-flux-queries-and-flux-tasks)
- [Data migration guides](#data-migration-guides)

## Should you migrate?

There are important things to consider with migrating to InfluxDB Clustered.
The following questions will help guide your decision to migrate.

#### Are you currently limited by series cardinality?

**Yes, you should migrate**. Series cardinality is a major limiting factor with
the InfluxDB TSM storage engine. The more unique series in your data, the less
performant your database.
The InfluxDB v3 storage engine supports near limitless series cardinality and is,
without question, the better solution for high series cardinality workloads.

#### Do you want to use SQL to query your data?

**Yes, you should migrate**. InfluxDB Clustered lets you query your time
series data with SQL. For more information about querying your data with SQL, see:

- [Query data with SQL](/influxdb/clustered/query-data/sql/)
- [InfluxDB SQL reference](/influxdb/clustered/reference/sql/)

#### Do you want better InfluxQL performance?

**Yes, you should migrate**. One of the primary goals when designing the InfluxDB
v3 storage engine was to enable performant implementations of both SQL and InfluxQL.
When compared to querying InfluxDB powered by TSM (InfluxDB OSS 1.x, 2.x, and Enterprise),
InfluxQL queries are more performant when querying InfluxDB powered by InfluxDB v3.

#### Are you reliant on Flux queries and Flux tasks?

**You should not migrate**. {{% product-name %}} doesn't support Flux.

---

## Data migration guides

{{< children >}}
