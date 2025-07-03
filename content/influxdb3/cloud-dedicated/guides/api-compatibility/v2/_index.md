---
title: Use the InfluxDB v2 API with InfluxDB Cloud Dedicated
list_title: InfluxDB v2 API compatibility
description: >
  Use the InfluxDB v2 API for new write workloads and existing v2 write workloads.
  InfluxDB Cloud Dedicated is compatible with the InfluxDB v2 API `/api/v2/write` endpoint and existing InfluxDB 2.x tools and code.
weight: 1
menu:
  influxdb3_cloud_dedicated:
    parent: API compatibility
    name: v2 API
influxdb3/cloud-dedicated/tags: [write, line protocol]
aliases:
  - /influxdb3/cloud-dedicated/primers/api/v2/
  - /influxdb3/cloud-dedicated/api-compatibility/v2/
related:
  - /influxdb3/cloud-dedicated/query-data/sql/
  - /influxdb3/cloud-dedicated/query-data/influxql/
  - /influxdb3/cloud-dedicated/write-data/
  - /influxdb3/cloud-dedicated/write-data/use-telegraf/configure/
  - /influxdb3/cloud-dedicated/reference/api/
  - /influxdb3/cloud-dedicated/reference/client-libraries/
---

Use the InfluxDB v2 API `/api/v2/write` endpoint for new write workloads and existing v2 write workloads that you bring to {{% product-name %}}.
Learn how to authenticate requests, adjust request parameters for existing v2 workloads, and find compatible tools for writing and querying data stored in an {{% product-name %}} database.

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
    - [Tools to execute queries](#tools-to-execute-queries)
    - [/api/v2/query not supported](#apiv2query-not-supported)

<!-- /TOC -->

## Authenticate API requests

InfluxDB API endpoints require each request to be authenticated with a
[database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens).

### Authenticate with a token

Use the `Authorization: Bearer` scheme or the `Authorization: Token` scheme to
pass a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
that has the necessary permissions for the operation.

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

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
{{% get-shared-text "api/cloud-dedicated/bearer-auth-v2-write.sh" %}}
```
{{% /code-placeholders %}}

Use `Token` to authenticate a write request:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
{{% get-shared-text "api/cloud-dedicated/token-auth-v2-write.sh" %}}
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with sufficient permissions to the specified database

## Responses

InfluxDB HTTP API responses use standard [HTTP status codes](/influxdb3/cloud-dedicated/api/#tag/Response-codes).
The response body for [partial writes](/influxdb3/cloud-dedicated/write-data/troubleshoot/#troubleshoot-rejected-points) and errors contains a JSON object with `code` and `message` properties that describe the error.
Response body messages may differ across {{% product-name %}} v1 API, v2 API, InfluxDB Cloud, and InfluxDB OSS.

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
  Provide the [database](/influxdb3/cloud-dedicated/admin/databases/) name.

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

Use the InfluxDB v2 API `/api/v2/write` endpoint for new write workloads and existing v2 workloads.

{{% api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/write" method="post"%}}

- [`/api/v2/write` parameters](#apiv2write-parameters)
- [Tools for writing to the v2 API](#tools-for-writing-to-the-v2-api)

### /api/v2/write parameters

For {{% product-name %}} v2 API `/api/v2/write` requests, set parameters as listed in the following table:

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

The following tools work with the {{% product-name %}} `/api/v2/write` endpoint:

- [Telegraf](#telegraf)
- [Interactive clients](#interactive-clients)
- [Client libraries](#client-libraries)

#### Telegraf

See how to [configure Telegraf](/influxdb3/cloud-dedicated/write-data/use-telegraf/configure/) to write to {{% product-name %}}.

#### Interactive clients

To test InfluxDB v2 API writes interactively, use the [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli) or common HTTP clients such as cURL and Postman.

To setup and start using interactive clients, see the [Get started](/influxdb3/cloud-dedicated/get-started/) tutorial.

> [!Warning]
> 
> #### influx CLI not supported
> 
> Don't use the `influx` CLI with {{% product-name %}}.
> While it may coincidentally work, it isn't officially supported.

#### Client libraries

InfluxDB [v3 client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/v3/) and [v2 client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/v2/)
can write data to the InfluxDB v2 API `/api/v2/write` endpoint.
Client libraries are language-specific packages that integrate InfluxDB APIs with your application.

To setup and start using client libraries, see the [Get started](/influxdb3/cloud-dedicated/get-started/) tutorial.

## Query data

{{% product-name %}} provides the following protocols for executing a query:

- [Flight+gRPC](https://arrow.apache.org/docs/format/Flight.html) request that contains an SQL or InfluxQL query.
  To learn how to query {{% product-name %}} using Flight and SQL, see the [Get started](/influxdb3/cloud-dedicated/get-started/) tutorial.
- InfluxDB v1 API `/query` request that contains an InfluxQL query.

> [!Note]
> 
> #### Tools to execute queries
> 
> {{% product-name %}} supports many different tools for querying data, including:
> 
> - [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
> - [InfluxDB 3 client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/v3/)
> - [Flight clients](/influxdb3/cloud-dedicated/reference/client-libraries/flight/)
> - [Superset](/influxdb3/cloud-dedicated/query-data/sql/execute-queries/superset/)
> - [Grafana](/influxdb3/cloud-dedicated/query-data/sql/execute-queries/grafana/)
> - [InfluxQL with InfluxDB v1 HTTP API](/influxdb3/cloud-dedicated/primers/api/v1/#query-using-the-v1-api)
> - [Chronograf](/chronograf/v1/)

> [!Warning]
> #### /api/v2/query not supported
> 
> The `/api/v2/query` API endpoint and associated tooling, such as the `influx`
> CLI and InfluxDB v2 client libraries, **aren’t** supported in {{% product-name %}}.
