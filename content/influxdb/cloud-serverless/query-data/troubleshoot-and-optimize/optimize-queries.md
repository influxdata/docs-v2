---
title: Optimize queries
description: >
  Optimize queries to improve performance and reduce their memory and compute (CPU) requirements in InfluxDB.
  Learn how to use observability tools to analyze query execution and view metrics.
weight: 201
menu:
  influxdb_cloud_serverless:
    name: Optimize queries
    parent: Troubleshoot and optimize queries
influxdb/cloud-serverless/tags: [query, performance, observability, errors, sql, influxql]
related:
  - /influxdb/cloud-serverless/query-data/sql/
  - /influxdb/cloud-serverless/query-data/influxql/
  - /influxdb/cloud-serverless/query-data/execute-queries/analyze-query-plan/
aliases:
  - /influxdb/cloud-serverless/query-data/execute-queries/optimize-queries/
---

Optimize SQL and InfluxQL queries to improve performance and reduce their memory and compute (CPU) requirements.
Learn how to use observability tools to analyze query execution and view metrics.

- [Why is my query slow?](#why-is-my-query-slow)
- [Strategies for improving query performance](#strategies-for-improving-query-performance)
- [Analyze and troubleshoot queries](#analyze-and-troubleshoot-queries)

## Why is my query slow?

Query performance depends on time range and complexity.
If a query is slower than you expect, it might be due to the following reasons:

- It queries data from a large time range.
- It includes intensive operations, such as querying many string values or `ORDER BY` sorting or re-sorting large amounts of data.

## Strategies for improving query performance

The following design strategies generally improve query performance and resource use:

- Follow [schema design best practices](/influxdb/cloud-serverless/write-data/best-practices/schema-design/) to make querying easier and more performant.
- Query only the data you need--for example, include a [`WHERE` clause](/influxdb/cloud-serverless/reference/sql/where/) that filters data by a time range.
  InfluxDB v3 stores data in a Parquet file for each measurement and day, and retrieves files from the Object store to answer a query.
  The smaller the time range in your query, the fewer files InfluxDB needs to retrieve from the Object store.
- [Downsample data](/influxdb/cloud-serverless/process-data/downsample/) to reduce the amount of data you need to query.

Some bottlenecks may be out of your control and are the result of a suboptimal execution plan, such as:

- Applying the same sort (`ORDER BY`) to already sorted data.
- Retrieving many Parquet files from the Object store--the same query performs better if it retrieves fewer - though, larger - files.
- Querying many overlapped Parquet files.
- Performing a large number of table scans.

{{% note %}}
#### Analyze query plans to view metrics and recognize bottlenecks

To view runtime metrics for a query, such as the number of files scanned, use the [`EXPLAIN ANALYZE` keywords](/influxdb/cloud-serverless/reference/sql/explain/#explain-analyze) and learn how to [analyze a query plan](/influxdb/cloud-serverless/query-data/troubleshoot-and-optimize/analyze-query-plan/).
{{% /note %}}

## Analyze and troubleshoot queries

Use the following tools to analyze and troubleshoot queries and find performance bottlenecks:

- [Analyze a query plan](/influxdb/cloud-serverless/query-data/analyze-query-plan/)
- [Enable trace logging for a query](#enable-trace-logging-for-a-query)

### Enable trace logging for a query

Customers with an {{% product-name %}} [annual or support contract](https://www.influxdata.com/influxdb-cloud-pricing/) can [contact InfluxData Support](https://support.influxdata.com/) to enable tracing and request help troubleshooting your query.
With tracing enabled, InfluxData Support can trace system processes and analyze log information for a query instance.
The tracing system follows the [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/) model for providing observability into a request.
