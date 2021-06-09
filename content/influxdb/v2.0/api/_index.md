---
title: Develop with the InfluxDB API
seotitle: Use the InfluxDB API
description: Interact with InfluxDB 2.0 using a rich API for writing and querying data and more.
weight: 3
menu:
  influxdb_2_0:
    name: Develop with the API
---

InfluxDB offers a rich API that you can integrate into your applications.
This section will guide you through the most commonly used API methods.

For detailed documentation on the entire API, see [InfluxDBv2 API Documentation](/influxdb/v2.0/reference/api/#influxdb-v2-api-documentation).

{{% note %}}
If you are interacting with InfluxDB 1.x, see the [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
{{% /note %}}

## Bootstrap your application

Prerequisites:
1. [Install](/influxdb/v2.0/install/) and run InfluxDB OSS v2.x,
2. [Install Influx CLI](influxdb/v2.0/get-started/)

With most API requests, you'll need to provide a minimum of your InfluxDB URL,
Organization, and Authorization Token.

### Create an authorization token
Before diving into the API, use the InfluxDB UI to
[create your initial authorization token](/influxdb/v2.0/security/tokens/create-token/).

## Write API

[Write data to InfluxDB](/influxdb/v2.0/write-data/developer-tools/api/) using an HTTP request to the InfluxDB API `/write` endpoint.

## Query API

[Query from InfluxDB](/influxdb/v2.0/query-data/execute-queries/influx-api/) using an HTTP request to the `/query` endpoint.
