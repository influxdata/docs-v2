---
title: Troubleshoot queries
description: >
  Troubleshoot SQL and InfluxQL queries in InfluxDB.
weight: 201
menu:
  influxdb_cloud_serverless:
    name: Troubleshoot queries
    parent: Troubleshoot and optimize queries
influxdb/cloud-serverless/tags: [query, performance, observability, errors, sql, influxql]
related:
  - /influxdb/cloud-serverless/query-data/sql/
  - /influxdb/cloud-serverless/query-data/influxql/
  - /influxdb/cloud-serverless/reference/client-libraries/v3/
aliases:
  - /influxdb/cloud-serverless/query-data/execute-queries/troubleshoot/
---

Troubleshoot SQL and InfluxQL queries that return unexpected results.

- [Why doesn't my query return data?](#why-doesnt-my-query-return-data)
- [Optimize slow or expensive queries](#optimize-slow-or-expensive-queries)

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

[Understand Arrow Flight responses](/influxdb/cloud-serverless/query-data/troubleshoot-and-optimize/flight-responses/) and error messages for queries.

## Optimize slow or expensive queries

If a query is slow or uses too many compute resources, limit the amount of data that it queries.

See how to [optimize queries](/influxdb/cloud-serverless/query-data/troubleshoot-and-optimize/optimize-queries/) and use tools to view runtime metrics, identify bottlenecks, and debug queries.
