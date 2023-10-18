---
title: Execute queries
description: >
  Use tools and libraries to query data stored in an InfluxDB cluster.
weight: 201
menu:
  influxdb_clustered:
    name: Execute queries
    parent: Query data
influxdb/clustered/tags: [query, sql, influxql]
aliases:
  - /influxdb/clustered/query-data/tools/
  - /influxdb/clustered/query-data/sql/execute-queries/
  - /influxdb/clustered/query-data/influxql/execute-queries/
---

Use tools and libraries to query data stored in an {{% product-name %}} bucket.

InfluxDB client libraries and Flight clients can use the Flight+gRPC protocol to query with SQL or InfluxQL and retrieve data in the [Arrow in-memory format](https://arrow.apache.org/docs/format/Columnar.html).
HTTP clients can use the InfluxDB v1 `/query` REST API to query with InfluxQL and retrieve data in formatted as JSON.

Learn how to connect to InfluxDB and query your data using the following tools:

{{< children readmore=true hr=true hlevel="h2" >}}
