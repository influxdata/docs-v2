---
title: Use the InfluxDB v2 API with InfluxDB Cloud Dedicated
list_title: InfluxDB v2 API compatibility
description: >
  Use the InfluxDB v2 API for new write workloads and existing v2 write workloads.
  InfluxDB Cloud Dedicated is compatible with the InfluxDB v2 API `/api/v2/write` endpoint and existing InfluxDB 2.x tools and code.
weight: 1
menu:
  influxdb_cloud_dedicated:
    parent: API compatibility
    name: v2 API
influxdb/cloud-dedicated/tags: [write, line protocol]
aliases:
  - /influxdb/cloud-dedicated/primers/api/v2/
related:
  - /influxdb/cloud-dedicated/query-data/sql/
  - /influxdb/cloud-dedicated/query-data/influxql/
  - /influxdb/cloud-dedicated/write-data/
  - /influxdb/cloud-dedicated/write-data/use-telegraf/configure/
  - /influxdb/cloud-dedicated/reference/api/
  - /influxdb/cloud-dedicated/reference/client-libraries/
---

Use the InfluxDB v2 API `/api/v2/write` endpoint for new write workloads and existing v2 write workloads that you bring to {{% cloud-name %}}.
Learn how to authenticate requests, adjust request parameters for existing v2 workloads, and find compatible tools for writing and querying data stored in a {{% cloud-name %}} database.

For help finding the best workflow for your situation, [contact Support](mailto:support@influxdata.com).

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
    - [influx CLI not supported](#influx-cli-not-supported)
    - [Client libraries](#client-libraries)
- [Query data](#query-data)
  - [/api/v2/query not supported](#apiv2query-not-supported)
    - [Tools to execute queries](#tools-to-execute-queries)

<!-- /TOC -->

## Authenticate API requests

InfluxDB API endpoints require each request to be authenticated with a [database token](/influxdb/cloud-dedicated/admin/tokens/).

### Authenticate with a token

Use the `Authorization: Bearer` scheme or the `Authorization: Token` scheme to pass a [database token](/influxdb/cloud-dedicated/admin/tokens/) that has the necessary permissions for the operation.

`Bearer` and `Token` are equivalent in InfluxDB Cloud Dedicated.
The `Token` scheme is used in the InfluxDB 2.x API.
`Bearer` is defined by the [OAuth 2.0 Framework](https://www.rfc-editor.org/rfc/rfc6750#page-14).
Support for one or the other may vary across InfluxDB API clients.

#### Syntax

```http
Authorization: Bearer DATABASE_TOKEN
```

```http
Authorization: Token DATABASE_TOKEN
```

#### Examples

Use `Bearer` to authenticate a write request:

```sh
{{% get-shared-text "api/cloud-dedicated/bearer-auth-v2-write.sh" %}}
```

Use `Token` to authenticate a write request:

```sh
{{% get-shared-text "api/cloud-dedicated/token-auth-v2-write.sh" %}}
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

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
  Provide the [database](/influxdb/cloud-dedicated/admin/databases/) name.

- **Failed to deserialize org/bucket/precision**

  ```http
  400 Bad Request
  ```
  
  ```json
  { "code":"invalid",
    "message":"failed to deserialize org/bucket/precision in request: unknown variant `u`, expected one of `s`, `ms`, `us`, `ns`"
  }
  ```

  The `?precision=` parameter contains an unknown value.
  Provide a [timestamp precision](#timestamp-precision).

## Write data

We recommend using the InfluxDB v2 API `/api/v2/write` endpoint for new write workloads and existing v2 workloads.

{{% api-endpoint endpoint="https://cluster-id.influxdb.io/api/v2/write" method="post"%}}

- [`/api/v2/write` parameters](#apiv2write-parameters)
- [Tools for writing to the v2 API](#tools-for-writing-to-the-v2-api)

### /api/v2/write parameters

Parameter        | Allowed in   | Ignored | Value
-----------------|--------------|---------|-------------------------
org              | Query string | Ignored | Non-zero-length string (ignored, but can't be empty)
orgID            | Query string | Ignored | N/A
bucket {{% req " \*" %}} | Query string | Honored | Database name
precision        | Query string | Honored | [Timestamp precision](#timestamp-precision)
Accept           | Header       | Honored | User-defined
`Authorization`  {{% req " \*" %}} | Header       | Honored | `Bearer DATABASE_TOKEN` or `Token DATABASE_TOKEN`
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

See how to configure the following tools for writing data to {{% cloud-name %}}:

- [Interactive clients](#interactive-command-line-clients)
- [Telegraf](#telegraf)
- [Client libraries](#client-libraries)

{{% warn %}}
While the `influx` CLI may coincidentally work with InfluxDB Cloud Serverless, it isn't officially supported.
{{% /warn %}}

#### Telegraf

See how to [configure Telegraf](/influxdb/cloud-dedicated/write-data/use-telegraf/configure/) using the [InfluxDB v2.x `influxdb_v2` Telegraf output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb_v2/README.md) to write to {{% cloud-name %}}.

#### Interactive clients

To test InfluxDB v2 API writes interactively, use the [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli) or common HTTP clients such as cURL and Postman.
To setup and start using command line clients, see the [Get started](/influxdb/cloud-dedicated/get-started/) tutorial.

{{% warn %}}

#### influx CLI not supported

Don't use the `influx` CLI with {{% cloud-name %}}.
While it may coincidentally work, it isn't officially supported.

{{% /warn %}}

#### Client libraries

InfluxDB [v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/) and [v2 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v2/)
can write data to the InfluxDB v2 API `/api/v2/write` endpoint.
Client libraries are language-specific packages that integrate InfluxDB APIs with your application.
To setup and start using client libraries, see the [Get started](/influxdb/cloud-dedicated/get-started/) tutorial.

## Query data

{{% cloud-name %}} provides the following protocols for executing a query:

- Flight+gRPC request that contains an SQL or InfluxQL query
- InfluxDB v1 API `/query` request that contains an InfluxQL query

### /api/v2/query not supported

The `/api/v2/query` API endpoint and associated tooling aren't supported in {{% cloud-name %}}.

{{% note %}}

#### Tools to execute queries

{{% cloud-name %}} supports many different tools for querying data, including:

- [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
- [InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-dedicated/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-dedicated/query-data/execute-queries/flight-sql/superset/)
- [Grafana](/influxdb/cloud-dedicated/query-data/tools/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-dedicated/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}
