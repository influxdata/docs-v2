---
title: Execute queries
description: >
  Use tools and libraries to query data stored in InfluxDB Cloud Serverless.
weight: 201
menu:
  influxdb3_cloud_serverless:
    name: Execute queries
    parent: Query data
influxdb3/cloud-serverless/tags: [query, sql, influxql]
aliases:
  - /influxdb3/cloud-serverless/query-data/tools/
  - /influxdb3/cloud-serverless/query-data/sql/execute-queries/
  - /influxdb3/cloud-serverless/query-data/influxql/execute-queries/
---

Use tools and libraries to query data stored in an {{% product-name %}} bucket.

InfluxDB 3 supports the following APIs and languages for querying data:

- Flight+RPC with SQL or InfluxQL.
  Use InfluxDB client libraries and Flight+RPC clients to query with SQL or InfluxQL and retrieve data in [Arrow in-memory format](https://arrow.apache.org/docs/format/Columnar.html).
- Flight SQL with SQL or InfluxQL.
  Use Flight SQL clients to query with SQL or InfluxQL and retrieve data in [Arrow in-memory format](https://arrow.apache.org/docs/format/Columnar.html).
- HTTP `/query` endpoint for InfluxDB v1 compatibility when you bring workloads and code from v1.x to v3.
  Use the `/query` endpoint with InfluxQL and tools such as Telegraf, HTTP clients, and InfluxDB v1 client libraries to query and retrieve data in JSON or CSV format.

> [!Warning]
> #### /api/v2/query endpoint can't query InfluxDB 3
> 
> {{% product-name %}} doesn't support the InfluxDB v2 HTTP `/api/v2/query` endpoint and isn't optimized for the Flux query language.
> Use SQL or InfluxQL to query data stored in InfluxDB 3.

Learn how to connect to InfluxDB and query your data using the following tools:

{{< children readmore=true hr=true hlevel="h2" >}}
