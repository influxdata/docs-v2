---
title: Execute queries
description: >
  Use tools and libraries to query data stored in InfluxDB Cloud Dedicated.
weight: 101
menu:
  influxdb3_cloud_dedicated:
    name: Execute queries
    parent: Query data
influxdb3/cloud-dedicated/tags: [query, sql, influxql]
aliases:
  - /influxdb3/cloud-dedicated/query-data/tools/
  - /influxdb3/cloud-dedicated/query-data/sql/execute-queries/
  - /influxdb3/cloud-dedicated/query-data/influxql/execute-queries/
---

Use tools and libraries to query data stored in an {{% product-name %}} bucket.

InfluxDB client libraries and Flight clients can use the Flight+gRPC protocol to query with SQL or InfluxQL and retrieve data in the [Arrow in-memory format](https://arrow.apache.org/docs/format/Columnar.html).
HTTP clients can use the InfluxDB v1 `/query` REST API to query with InfluxQL and retrieve data in JSON format.

Learn how to connect to InfluxDB and query your data using the following tools:

{{< children readmore=true hr=true hlevel="h2" >}}
