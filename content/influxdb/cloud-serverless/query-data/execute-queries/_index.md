---
title: Execute queries
description: >
  Use tools and libraries to query data stored in InfluxDB Cloud Serverless.
weight: 201
menu:
  influxdb_cloud_serverless:
    name: Execute queries
    parent: Query data
influxdb/cloud-serverless/tags: [query, sql, influxql]
aliases:
  - /influxdb/cloud-serverless/query-data/tools/
  - /influxdb/cloud-serverless/query-data/sql/execute-queries/
  - /influxdb/cloud-serverless/query-data/influxql/execute-queries/
---

Use tools and libraries to query data stored in an {{% cloud-name %}} bucket.

InfluxDB client libraries and Flight clients can use the Flight+gRPC protocol to query with SQL or InfluxQL and retrieve data in the [Arrow in-memory format](https://arrow.apache.org/docs/format/Columnar.html).
HTTP clients can use the InfluxDB v1 `/query` REST API to query with InfluxQL and retrieve data in formatted as JSON.

{{% note %}}
#### Map databases and retention policies to buckets

Before using InfluxQL, make sure database and retention policy (DBRP)
combinations are mapped to buckets. For more information, see
[Map databases and retention policies to buckets](/influxdb/cloud-serverless/query-data/influxql/dbrp/).
{{% /note %}}

Learn how to connect to InfluxDB and query your data using the following tools:

{{< children readmore=true hr=true hlevel="h2" >}}
