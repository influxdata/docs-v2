---
title: Troubleshoot queries
description: >
  Troubleshoot SQL and InfluxQL queries in InfluxDB.
weight: 201
menu:
  influxdb3_clustered:
    name: Troubleshoot queries
    parent: Troubleshoot and optimize queries
influxdb3/clustered/tags: [query, performance, observability, errors, sql, influxql]
related:
  - /influxdb3/clustered/query-data/sql/
  - /influxdb3/clustered/query-data/influxql/
  - /influxdb3/clustered/reference/client-libraries/v3/
aliases:
  - /influxdb3/clustered/query-data/execute-queries/troubleshoot/
---

Troubleshoot SQL and InfluxQL queries that return unexpected results.

- [Why doesn't my query return data?](#why-doesnt-my-query-return-data)
- [Optimize slow or expensive queries](#optimize-slow-or-expensive-queries)
- [Analyze your queries](#analyze-your-queries)
- [Request help to troubleshoot queries](#request-help-to-troubleshoot-queries)

## Why doesn't my query return data?

If a query doesn't return any data, it might be due to the following:

- Your data falls outside the time range (or other conditions) in the query--for example, the InfluxQL `SHOW TAG VALUES` command uses a default time range of 1 day.
- The query (InfluxDB server) timed out.
- The query client timed out.
- The query return type is not supported by the client library.
  For example, array or list types may not be supported.
  In this case, use `array_to_string()` to convert the array value to a string--for example:

  ```sql
  SELECT array_to_string(array_agg([1, 2, 3]), ', ')
  ```

If a query times out or returns an error, it might be due to the following:

- a bad request
- a server or network problem
- it queries too much data

[Understand Arrow Flight responses](/influxdb3/clustered/query-data/troubleshoot-and-optimize/flight-responses/) and error messages for queries.

## Optimize slow or expensive queries

If a query is slow or uses too many compute resources, limit the amount of data that it queries.

See how to [optimize queries](/influxdb3/clustered/query-data/troubleshoot-and-optimize/optimize-queries/).

## Analyze your queries 

Use the following tools to retrieve system query information, analyze query execution,
and find performance bottlenecks:

- [Analyze a query plan](/influxdb3/clustered/query-data/troubleshoot-and-optimize/analyze-query-plan/)
- [Retrieve `system.queries` information for a query](/influxdb3/clustered/query-data/troubleshoot-and-optimize/system-information/)

#### Request help to troubleshoot queries

Some bottlenecks may result from suboptimal query [execution plans](/influxdb3/clustered/reference/internals/query-plan/#physical-plan) and are outside your control--for example:

- Sorting (`ORDER BY`) data that is already sorted
- Retrieving numerous small Parquet files from the object store, instead of fewer, larger files
- Querying many overlapped Parquet files
- Performing a high number of table scans

If you have followed steps to [optimize](/influxdb3/clustered/query-data/troubleshoot-and-optimize/optimize-queries/) and [troubleshoot a query](#why-doesnt-my-query-return-data),
and it isn't meeting your performance requirements,
see how to [report query performance issues](/influxdb3/clustered/query-data/troubleshoot-and-optimize/report-query-performance-issues/).

> [!Note]
>
> #### Query trace logging
>
> Currently, customers cannot enable trace logging for {{% product-name omit="Clustered" %}} clusters.
> InfluxData engineers can use query plans and trace logging to help pinpoint performance bottlenecks in a query.
>
> See how to [report query performance issues](/influxdb3/clustered/query-data/troubleshoot-and-optimize/report-query-performance-issues/).
