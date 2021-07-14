---
title: Working with the InfluxDB API
seotitle: Use the InfluxDB API
description: Interact with InfluxDB 2.0 using a rich API for writing and querying data and more.
weight: 103
menu:
  influxdb_2_0:
    name: Working with the API
    parent: Tools & integrations
---

InfluxDB offers a rich API that you can use to create applications.
The following pages offer general guides to the most commonly used API methods.

For detailed documentation on the entire API, see [InfluxDBv2 API Documentation](/influxdb/v2.0/reference/api/#influxdb-v2-api-documentation).

{{% note %}}
If you need to use InfluxDB 2.0 with **InfluxDB 1.x** API clients and integrations, see the [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
{{% /note %}}

Use the following API endpoints to write and query data:

## Write API

[Write data to InfluxDB](/influxdb/v2.0/write-data/developer-tools/api/) using an HTTP request to the InfluxDB API `/write` endpoint.

## Query API

[Query from InfluxDB](/influxdb/v2.0/query-data/execute-queries/influx-api/) using an HTTP request to the `/query` endpoint.
