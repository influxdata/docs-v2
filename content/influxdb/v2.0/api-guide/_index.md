---
title: Develop with the InfluxDB API
seotitle: Use the InfluxDB API
description: Interact with InfluxDB 2.0 using a rich API for writing and querying data and more.
weight: 3
menu:
  influxdb_2_0:
    name: Develop with the API
---

InfluxDB offers a rich API and [client libraries](/influxdb/v2.0/api/client-libraries) ready to integrate with your application.
This section will guide you through the most commonly used API methods.

For detailed documentation on the entire API, see [InfluxDBv2 API Reference](/influxdb/v2.0/reference/api/#influxdb-v2-api-documentation).

{{% note %}}
If you are interacting with InfluxDB 1.x, see the [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
{{% /note %}}

## Bootstrap your application

With most API requests, you'll need to provide a minimum of your InfluxDB URL, Organization, and Authorization Token.

[Install InfluxDB OSS v2.x](/influxdb/v2.0/install/) or upgrade to
an [InfluxDB Cloud account](/influxdb/cloud/sign-up).

### Authentication

Before diving into the API, use the InfluxDB UI to
[create an initial authentication token](/influxdb/v2.0/security/tokens/create-token/) for your application.

InfluxDB uses [authentication tokens](/influxdb/cloud/security/tokens/) to authorize API requests.
Include your authentication token as an `Authorization` header in each request.

```sh
{{% api/curl/auth %}}
```

## Bucket API

Before writing data you'll need to create a Bucket in InfluxDB.
[Create a bucket](/influxdb/v2.0/buckets/developer-tools/api/) using an HTTP request to the InfluxDB API `bucket` endpoint.

## Write API

[Write data to InfluxDB](/influxdb/v2.0/write-data/developer-tools/api/) using an HTTP request to the InfluxDB API `/write` endpoint.

## Query API

[Query from InfluxDB](/influxdb/v2.0/query-data/execute-queries/influx-api/) using an HTTP request to the `/query` endpoint.
