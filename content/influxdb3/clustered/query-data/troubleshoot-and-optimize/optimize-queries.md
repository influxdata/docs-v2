---
title: Optimize queries
description: >
  Optimize queries to improve performance and reduce their memory and compute (CPU) requirements in InfluxDB.
  Learn how to use observability tools to analyze query execution and view metrics.
weight: 201
menu:
  influxdb3_clustered:
    name: Optimize queries
    parent: Troubleshoot and optimize queries
influxdb3/clustered/tags: [query, performance, observability, errors, sql, influxql]
related:
  - /influxdb3/clustered/query-data/sql/
  - /influxdb3/clustered/query-data/influxql/
  - /influxdb3/clustered/query-data/execute-queries/analyze-query-plan/
aliases:
  - /influxdb3/clustered/query-data/execute-queries/optimize-queries/
  - /influxdb3/clustered/query-data/execute-queries/analyze-query-plan/
  - /influxdb3/clustered/query-data/optimize-queries/
---

Optimize SQL and InfluxQL queries to improve performance and reduce their memory and compute (CPU) requirements.
Learn how to use observability tools to analyze query execution and view metrics.

- [Why is my query slow?](#why-is-my-query-slow)
- [Strategies for improving query performance](#strategies-for-improving-query-performance)
  - [Query only the data you need](#query-only-the-data-you-need)
- [Recognize and address bottlenecks](#recognize-and-address-bottlenecks)


## Why is my query slow?

Query performance depends on factors like the time range and query complexity.
If a query is slower than expected, consider the following potential causes:

- The query spans a large time range, which increases the amount of data being processed.
- The query performs intensive operations, such as:
  - Sorting or re-sorting large datasets with `ORDER BY`.
  - Querying many string values, which can be computationally expensive.

## Strategies for improving query performance

The following design strategies generally improve query performance and resource usage:

- Follow [schema design best practices](/influxdb3/clustered/write-data/best-practices/schema-design/) to simplify and improve queries.
- [Query only the data you need](#query-only-the-data-you-need) to reduce unnecessary processing.
- [Downsample data](/influxdb3/clustered/process-data/downsample/) to decrease the volume of data queried.

### Query only the data you need

#### Include a WHERE clause

InfluxDB v3 stores data in a Parquet file for each partition.
By default, {{< product-name >}} partitions tables by day, but you can also
[custom-partition your data](/influxdb3/clustered/admin/custom-partitions/).
At query time, InfluxDB retrieves files from the Object store to answer a query.
To reduce the number of files that a query needs to retrieve from the Object store,
include a [`WHERE` clause](/influxdb3/clustered/reference/sql/where/) that
filters data by a time range or by specific tag values.

#### SELECT only columns you need 

Because InfluxDB v3 is a columnar database, it only processes the columns
selected in a query, which can mitigate the query performance impact of
[wide schemas](/influxdb3/clustered/write-data/best-practices/schema-design/#avoid-wide-schemas).

However, a non-specific query that retrieves a large number of columns from a
wide schema can be slower and less efficient than a more targeted
query--for example, consider the following queries:

- `SELECT time,a,b,c`
- `SELECT *`

If the table contains 10 columns, the difference in performance between the
two queries is minimal.
In a table with over 1000 columns, the `SELECT *` query is slower and
less efficient.

## Recognize and address bottlenecks

To identify performance bottlenecks, learn how to [analyze a query plan](/influxdb3/clustered/query-data/troubleshoot-and-optimize/analyze-query-plan/).
Query plans provide runtime metrics, such as the number of files scanned, that may reveal inefficiencies in query execution.

> [!Note]
>
> #### Request help to troubleshoot queries
>
> Some bottlenecks may result from suboptimal query [execution plans](/influxdb3/clustered/reference/internals/query-plan/#physical-plan) and are outside your control--for example:
>
> - Sorting (`ORDER BY`) data that is already sorted.
> - Retrieving numerous small Parquet files from the object store instead of fewer, larger files.
> - Querying many overlapped Parquet files.
> - Performing a high number of table scans.
>
> If you've followed steps to [optimize](#why-is-my-query-slow) and
> [troubleshoot a query](/influxdb3/clustered/query-data/troubleshoot-and-optimize/troubleshoot/),
> but it still doesn't meet performance requirements,
> see how to [report query performance issues](/influxdb3/clustered/query-data/troubleshoot-and-optimize/report-query-performance-issues/).
>
> #### Query trace logging
>
> Currently, customers cannot enable trace logging for {{% product-name omit="Clustered" %}} clusters.
> InfluxData engineers can use query plans and trace logging to help pinpoint performance bottlenecks in a query.
>
> See how to [report query performance issues](/influxdb3/clustered/query-data/troubleshoot-and-optimize/report-query-performance-issues/).
