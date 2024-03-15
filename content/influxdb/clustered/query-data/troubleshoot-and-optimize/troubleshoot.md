---
title: Troubleshoot queries
description: >
  Troubleshoot SQL and InfluxQL queries in InfluxDB.
weight: 201
menu:
  influxdb_clustered:
    name: Troubleshoot queries
    parent: Troubleshoot and optimize queries
influxdb/clustered/tags: [query, performance, observability, errors, sql, influxql]
related:
  - /influxdb/clustered/query-data/sql/
  - /influxdb/clustered/query-data/influxql/
  - /influxdb/clustered/reference/client-libraries/v3/
aliases:
  - /influxdb/clustered/query-data/execute-queries/troubleshoot/
---

Troubleshoot SQL and InfluxQL queries that return unexpected results.

- [Why doesn't my query return data?](#why-doesnt-my-query-return-data)
- [Optimize slow or expensive queries](#optimize-slow-or-expensive-queries)

## Why doesn't my query return data?

If a query doesn't return any data, it might be due to the following:

- Your data falls outside the time range (or other conditions) in the query--for example, the InfluxQL `SHOW TAG VALUES` command uses a default time range of 1 day.
- The query (InfluxDB server) timed out.
- The query client timed out.

If a query times out or returns an error, it might be due to the following:

- a bad request
- a server or network problem
- it queries too much data

[Understand Arrow Flight responses](/influxdb/clustered/query-data/troubleshoot-and-optimize/flight-responses/) and error messages for queries.

## Optimize slow or expensive queries

If a query is slow or uses too many compute resources, limit the amount of data that it queries.

See how to [optimize queries](/influxdb/clustered/query-data/troubleshoot-and-optimize/optimize-queries/) and use tools to view runtime metrics, identify bottlenecks, and debug queries.
