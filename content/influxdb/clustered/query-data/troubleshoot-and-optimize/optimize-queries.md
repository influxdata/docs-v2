---
title: Optimize queries
description: >
  Optimize queries to improve performance and reduce their memory and compute (CPU) requirements in InfluxDB.
  Learn how to use observability tools to analyze query execution and view metrics.
weight: 201
menu:
  influxdb_clustered:
    name: Optimize queries
    parent: Troubleshoot and optimize queries
influxdb/clustered/tags: [query, performance, observability, errors, sql, influxql]
related:
  - /influxdb/clustered/query-data/sql/
  - /influxdb/clustered/query-data/influxql/
  - /influxdb/clustered/query-data/execute-queries/analyze-query-plan/
aliases:
  - /influxdb/clustered/query-data/execute-queries/optimize-queries/
  - /influxdb/clustered/query-data/execute-queries/analyze-query-plan/
---

Optimize SQL and InfluxQL queries to improve performance and reduce their memory and compute (CPU) requirements.
Learn how to use observability tools to analyze query execution and view metrics.

- [Why is my query slow?](#why-is-my-query-slow)
- [Strategies for improving query performance](#strategies-for-improving-query-performance)
  - [Query only the data you need](#query-only-the-data-you-need)
- [Analyze and troubleshoot queries](#analyze-and-troubleshoot-queries)

## Why is my query slow?

Query performance depends on time range and complexity.
If a query is slower than you expect, it might be due to the following reasons:

- It queries data from a large time range.
- It includes intensive operations, such as querying many string values or `ORDER BY` sorting or re-sorting large amounts of data.

## Strategies for improving query performance

The following design strategies generally improve query performance and resource use:

- Follow [schema design best practices](/influxdb/clustered/write-data/best-practices/schema-design/) to make querying easier and more performant.
- [Query only the data you need](#query-only-the-data-you-need).
- [Downsample data](/influxdb/clustered/process-data/downsample/) to reduce the amount of data you need to query.

Some bottlenecks may be out of your control and are the result of a suboptimal execution plan, such as:

- Applying the same sort (`ORDER BY`) to already sorted data.
- Retrieving many Parquet files from the Object store--the same query performs better if it retrieves fewer - though, larger - files.
- Querying many overlapped Parquet files.
- Performing a large number of table scans.

{{% note %}}
#### Analyze query plans to view metrics and recognize bottlenecks

To view runtime metrics for a query, such as the number of files scanned, use
the [`EXPLAIN ANALYZE` keywords](/influxdb/clustered/reference/sql/explain/#explain-analyze)
and learn how to [analyze a query plan](/influxdb/clustered/query-data/troubleshoot-and-optimize/analyze-query-plan/).
{{% /note %}}

### Query only the data you need

#### Include a WHERE clause

InfluxDB v3 stores data in a Parquet file for each partition.
By default, {{< product-name >}} partitions tables by day, but you can also
[custom-partition your data](/influxdb/clustered/admin/custom-partitions/).
At query time, InfluxDB retrieves files from the Object store to answer a query.
To reduce the number of files that a query needs to retrieve from the Object store,
include a [`WHERE` clause](/influxdb/clustered/reference/sql/where/) that
filters data by a time range or by specific tag values.

#### SELECT only columns you need 

Because InfluxDB v3 is a columnar database, it only processes the columns
selected in a query, which can mitigate the query performance impact of
[wide schemas](/influxdb/clustered/write-data/best-practices/schema-design/#avoid-wide-schemas).

However, a non-specific query that retrieves a large number of columns from a
wide schema can be slower and less efficient than a more targeted
query--for example, consider the following queries:

- `SELECT time,a,b,c`
- `SELECT *`

If the table contains 10 columns, the difference in performance between the
two queries is minimal.
In a table with over 1000 columns, the `SELECT *` query is slower and
less efficient.

## Analyze and troubleshoot queries

Learn how to [analyze a query plan](/influxdb/clustered/query-data/troubleshoot-and-optimize/analyze-query-plan/)
to troubleshoot queries and find performance bottlenecks.

If you need help troubleshooting, follow the guidelines to
[report query performance issues](/influxdb/clustered/query-data/troubleshoot-and-optimize/report-query-performance-issues/).
