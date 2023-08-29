---
title: Use the InfluxDB v2 API with InfluxDB Cloud Serverless
list_title: InfluxDB v2 API compatibility
description: >
  Use the InfluxDB v2 API for new write workloads and existing v2 write workloads.
  InfluxDB Cloud Serverless is compatible with the InfluxDB v2 API `/api/v2/write` endpoint and existing InfluxDB 2.x tools and code.
weight: 1
menu:
  influxdb_cloud_serverless:
    parent: API compatibility
    name: v2 API
influxdb/cloud-serverless/tags: [write, line protocol]
aliases:
  - /influxdb/cloud-serverless/primers/api/v2/
  - /influxdb/cloud-serverless/api-compatibility/v2/
related:
  - /influxdb/cloud-serverless/query-data/sql/
  - /influxdb/cloud-serverless/query-data/influxql/
  - /influxdb/cloud-serverless/write-data/
  - /influxdb/cloud-serverless/write-data/use-telegraf/configure/
  - /influxdb/cloud-serverless/reference/api/
  - /influxdb/cloud-serverless/reference/client-libraries/
---

{{% cloud-name %}} is compatible with the InfluxDB v2 API `/api/v2/write` endpoint and existing InfluxDB 2.x tools and code.
Use the InfluxDB v2 API for new write workloads and existing v2 write workloads that you bring to {{% cloud-name %}}.

InfluxDB v2 API endpoints won't work for managing resources or querying data in {{% cloud-name %}}.
To query data, use the _Flight+gRPC_ protocol  or the InfluxDB v1 `/query` HTTP API endpoint and [associated tools](#tools-to-execute-queries).

<!-- TOC -->

- [Authenticate API requests](#authenticate-api-requests)
  - [Authenticate with a token](#authenticate-with-a-token)
    - [Syntax](#syntax)
    - [Examples](#examples)
- [Responses](#responses)
  - [Error examples](#error-examples)
- [Write data](#write-data)
  - [/api/v2/write parameters](#apiv2write-parameters)
    - [Timestamp precision](#timestamp-precision)
  - [Tools for writing to the v2 API](#tools-for-writing-to-the-v2-api)
    - [Telegraf](#telegraf)
    - [Interactive clients](#interactive-clients)
    - [Client libraries](#client-libraries)
- [Query data](#query-data)
    - [Tools to execute queries](#tools-to-execute-queries)
  - [/api/v2/query not supported](#apiv2query-not-supported)

<!-- /TOC -->

## Authenticate API requests

InfluxDB API endpoints require each request to be authenticated with an [API token](/influxdb/cloud-serverless/admin/tokens/).

### Authenticate with a token

Use the `Authorization: Token` scheme to pass an [API token](/influxdb/cloud-serverless/admin/tokens/) that has the necessary permissions for the operation.

The `Token` scheme is used in the InfluxDB 2.x API.

#### Syntax

```http
Authorization: Token API_TOKEN
```

#### Examples

Use `Token` to authenticate a write request:

{{% code-placeholders "BUCKET_NAME|API_TOKEN" %}}
```sh
# Use the Token authentication scheme with /api/v2/write
curl --post "https://cloud2.influxdata.com/api/v2/write?bucket=BUCKET_NAME&precision=s" \
  --header "Authorization: Token API_TOKEN" \
  --data-binary 'home,room=kitchen temp=72 1463683075'
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: your InfluxDB Cloud Serverless [bucket](/influxdb/cloud-serverless/admin/buckets/)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: an [API token](/influxdb/cloud-serverless/admin/tokens/) with sufficient permissions to the database

## Responses

InfluxDB API responses use standard HTTP status codes.
For successful writes, InfluxDB responds with a `204 No Content` status code.
Error responses contain a JSON object with `code` and `message` properties that describe the error.
Response body messages may differ across {{% cloud-name %}} v1 API, v2 API, InfluxDB Cloud, and InfluxDB OSS.

### Error examples

- **Missing bucket value**

  ```http
  400 Bad Request
  ```
  
  ```json
  { "code": "invalid",
    "message":"missing bucket value"
  }
  ```

  The `?bucket=` parameter value is missing in the request.
  Provide the [bucket](/influxdb/cloud-serverless/admin/buckets/) name.

- **Failed to deserialize org/bucket/precision**

  ```http
  400 Bad Request
  ```
  
  ```json
  { "code": "invalid",
    "message":"failed to deserialize org/bucket/precision in request: unknown variant `u`, expected one of `s`, `ms`, `us`, `ns`"
  }
  ```

  The `?precision=` parameter contains an unknown value.
  Provide a [timestamp precision](#timestamp-precision).

## Write data

We recommend using the InfluxDB v2 API `/api/v2/write` endpoint for new write workloads and existing v2 workloads.

{{% api-endpoint endpoint="https://cloud2.influxdata.com/api/v2/write" method="post"%}}

- [`/api/v2/write` parameters](#apiv2write-parameters)
- [Tools for writing to the v2 API](#tools-for-writing-to-the-v2-api)

### /api/v2/write parameters

For {{% cloud-name %}} v2 API `/api/v2/write` requests, set parameters as listed in the following table:

Parameter        | Allowed in   | Ignored | Value
-----------------|--------------|---------|-------------------------
org              | Query string | Ignored | Non-zero-length string (ignored, but can't be empty)
orgID            | Query string | Ignored | N/A
bucket {{% req " \*" %}} | Query string | Honored | Database name
precision        | Query string | Honored | [Timestamp precision](#timestamp-precision)
Accept           | Header       | Honored | User-defined
`Authorization`  {{% req " \*" %}} | Header       | Honored | `Token API_TOKEN`
`Content-Encoding`     | Header       | Honored | `gzip` (compressed data) or `identity` (uncompressed)
Content-Length   | Header       | Honored | User-defined
Content-Type     | Header       | Ignored | N/A (only supports line protocol)
Zap-Trace-Span   | Header       | Ignored |

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision

Use one of the following `precision` values in v2 API `/api/v2/write` requests:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

### Tools for writing to the v2 API

The following tools work with the {{% cloud-name %}} `/api/v2/write` endpoint:

- [Telegraf](#telegraf)
- [Interactive clients](#interactive-clients)
- [Client libraries](#client-libraries)

#### Telegraf

See how to [configure Telegraf](/influxdb/cloud-serverless/write-data/use-telegraf/configure/) to write to {{% cloud-name %}}.

#### Interactive clients

To test InfluxDB v2 API writes interactively from the command line, use the [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli) or common HTTP clients such as cURL and Postman.

To setup and start using interactive clients, see the [Get started](/influxdb/cloud-serverless/get-started/) tutorial.

#### Client libraries

InfluxDB [v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/) and [v2 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v2/) can write data to the InfluxDB v2 API `/api/v2/write` endpoint.
Client libraries are language-specific packages that integrate InfluxDB APIs with your application.

To setup and start using client libraries, see the [Get started](/influxdb/cloud-serverless/get-started/) tutorial.

## Query data

InfluxDB v3 provides the following protocols for executing a query:

- [Flight+gRPC](https://arrow.apache.org/docs/format/Flight.html) request that contains an SQL or InfluxQL query.
  To learn how to query {{% cloud-name %}} using Flight and SQL, see the [Get started](/influxdb/cloud-serverless/get-started/) tutorial.
- InfluxDB v1 API `/query` request that contains an InfluxQL query.

{{% note %}}

#### Tools to execute queries

{{% cloud-name %}} supports many different tools for querying data, including:

- [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
- [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-serverless/reference/client-libraries/flight/)
- [Superset](/influxdb/cloud-serverless/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-serverless/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-serverless/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}

### /api/v2/query not supported

The `/api/v2/query` API endpoint and associated tooling aren't supported in {{% cloud-name %}}.

