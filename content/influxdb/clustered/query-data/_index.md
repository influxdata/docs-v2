---
title: Query data in InfluxDB Clustered
seotitle: Query data stored in InfluxDB Clustered
description: >
  Learn to query data stored in InfluxDB using SQL and InfluxQL.
menu:
  influxdb_clustered:
    name: Query data
weight: 4
influxdb/clustered/tags: [query]
---

Learn to query data stored in InfluxDB.

{{% note %}}

#### Choose the query method for your workload

- For new query workloads, use one of the many available [Flight clients](/influxdb/clustered/tags/flight-client/) and SQL or InfluxQL.
- [Use the HTTP API `/query` endpoint and InfluxQL](/influxdb/clustered/query-data/execute-queries/influxdb-v1-api/) when you bring existing v1 query workloads to {{% product-name %}}.

{{% /note %}}

{{< children >}}
