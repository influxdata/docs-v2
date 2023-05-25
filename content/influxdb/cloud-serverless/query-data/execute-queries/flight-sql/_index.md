---
title: Query with Flight SQL
seotitle: Query InfluxDB with Arrow Flight SQL
description: >
  Query your data using Apache Arrow Flight SQL protocol and clients.
weight: 201
menu:
  influxdb_cloud_serverless:
    name: Query with Flight SQL
    parent: Execute queries
influxdb/cloud-serverless/tags: [query, flightsql]
aliases:
  - /influxdb/cloud-serverless/query-data/execute-queries/influx-api/
---

Use [Apache Arrow Flight SQL](https://arrow.apache.org/) to query data
stored in an InfluxDB Cloud Serverless bucket.

> Arrow Flight SQL is a protocol for interacting with SQL databases using the
> [Arrow in-memory format](https://arrow.apache.org/docs/format/Columnar.html)
> and the [Flight RPC](https://arrow.apache.org/docs/format/Flight.html) framework.
>
> {{% cite %}}-- [Apache Arrow Flight SQL documentation](https://arrow.apache.org/docs/format/FlightSql.html){{% /cite %}}

Data platforms and clients that support the Flight SQL protocol can query data
stored in an InfluxDB Cloud Serverless bucket.
Learn how to connect to InfluxDB and query your data using the following tools:

{{< children >}}