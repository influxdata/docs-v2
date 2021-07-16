---
title: API Quick Start
seotitle: Use the InfluxDB API
description: Interact with InfluxDB 2.0 using a rich API for writing and querying data and more.
weight: 3
menu:
  influxdb_2_0:
    name: Quick Start
    parent: Develop with the API
aliases:
  - /influxdb/v2.0/tools/api/
influxdb/cloud/tags: [api]
---

InfluxDB offers a rich API and [client libraries](/influxdb/v2.0/api-guide/client-libraries) ready to integrate with your application. Use popular tools like Curl and [Postman](/influxdb/v2.0/api-guide/postman) for rapidly testing API requests.

This section will guide you through the most commonly used API methods.

For detailed documentation on the entire API, see [InfluxDBv2 API Reference](/influxdb/v2.0/reference/api/#influxdb-v2-api-documentation).

{{% note %}}
If you need to use InfluxDB 2.0 with **InfluxDB 1.x** API clients and integrations, see the [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
{{% /note %}}

## Bootstrap your application

With most API requests, you'll need to provide a minimum of your InfluxDB URL, Organization, and Authorization Token.

[Install InfluxDB OSS v2.x](/influxdb/v2.0/install/) or upgrade to
an [InfluxDB Cloud account](/influxdb/cloud/sign-up).

### Authentication

Before diving into the API, use the InfluxDB UI to
[create an initial authentication token](/influxdb/v2.0/security/tokens/create-token/) for your application.

InfluxDB uses [authentication tokens](/influxdb/v2.0/security/tokens/) to authorize API requests.
Include your authentication token as an `Authorization` header in each request.

#### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-shared-text "api/v2.0/auth/oss/token-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-shared-text "api/v2.0/auth/oss/token-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Postman is another popular tool for exploring APIs. See how to [send authenticated requests with Postman](/{{< latest "influxdb" >}}/api-guide/postman/#send-authenticated-api-requests-with-postman).

## Buckets API

Before writing data you'll need to create a Bucket in InfluxDB.
[Create a bucket](/{{< latest "influxdb" >}}/organizations/buckets/create-bucket/#create-a-bucket-using-the-influxdb-api) using an HTTP request to the InfluxDB API `/buckets` endpoint.

#### Example

```sh
{{% get-shared-text "api/v2.0/buckets/oss/create.sh" %}}
```

## Write API

[Write data to InfluxDB](/influxdb/v2.0/write-data/developer-tools/api/) using an HTTP request to the InfluxDB API `/write` endpoint.

## Query API

[Query from InfluxDB](/influxdb/v2.0/query-data/execute-queries/influx-api/) using an HTTP request to the `/query` endpoint.
