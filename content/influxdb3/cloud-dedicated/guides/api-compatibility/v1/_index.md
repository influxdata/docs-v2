---
title: Use the InfluxDB v1 API with InfluxDB Cloud Dedicated
list_title: InfluxDB v1 API compatibility
description: >
  Use InfluxDB v1 API authentication, endpoints, and tools when bringing existing 1.x workloads to InfluxDB Cloud Dedicated.
weight: 3
menu:
  influxdb3_cloud_dedicated:
    parent: API compatibility
    name: v1 API
aliases:
  - /influxdb3/cloud-dedicated/primers/api/v1/
  - /influxdb3/cloud-dedicated/api-compatibility/v1/
influxdb3/cloud-dedicated/tags: [write, line protocol]
related:
  - /influxdb3/cloud-dedicated/query-data/sql/
  - /influxdb3/cloud-dedicated/query-data/influxql/
  - /influxdb3/cloud-dedicated/write-data/
  - /influxdb3/cloud-dedicated/write-data/use-telegraf/configure/
  - /influxdb3/cloud-dedicated/reference/api/
  - /influxdb3/cloud-dedicated/reference/client-libraries/
---

Use the InfluxDB v1 API `/write` and `/query` endpoints with v1 workloads that you bring to {{% product-name %}}.
The v1 endpoints work with username/password authentication and existing InfluxDB 1.x tools and code.
The InfluxDB v1 API `/write` endpoint works with InfluxDB 1.x client libraries and the [Telegraf v1 Output Plugin](/telegraf/v1/plugins/#output-influxdb).
The InfluxDB v1 API `/query` endpoint supports InfluxQL and third-party integrations like [Grafana](https://grafana.com).

Learn how to authenticate requests, adjust request parameters for existing v1 workloads, and find compatible tools for writing and querying data stored in an {{% product-name %}} database.

<!-- TOC -->

- [Authenticate API requests](#authenticate-api-requests)
  - [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
    - [Basic authentication](#basic-authentication)
      - [Syntax](#syntax)
      - [Example](#example)
    - [Query string authentication](#query-string-authentication)
      - [Syntax](#syntax)
      - [Example](#example)
  - [Authenticate with a token scheme](#authenticate-with-a-token-scheme)
    - [Syntax](#syntax)
    - [Examples](#examples)
- [Responses](#responses)
  - [Error examples](#error-examples)
- [Write data](#write-data)
    - [v1 API /write parameters](#v1-api-write-parameters)
    - [Timestamp precision](#timestamp-precision)
  - [Tools for writing to the v1 API](#tools-for-writing-to-the-v1-api)
    - [Telegraf](#telegraf)
      - [Other Telegraf configuration options](#other-telegraf-configuration-options)
    - [Interactive clients](#interactive-clients)
      - [v1 CLI not supported](#v1-cli-not-supported)
    - [Client libraries](#client-libraries)
- [Query data](#query-data)
    - [Tools to execute queries](#tools-to-execute-queries)
  - [v1 API /query parameters](#v1-api-query-parameters)
    - [Timestamp precision](#timestamp-precision)
  - [Database management with InfluxQL not supported](#database-management-with-influxql-not-supported)

<!-- /TOC -->

## Authenticate API requests

{{% product-name %}} requires each API request to be authenticated with a
[database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens).
With InfluxDB v1-compatible endpoints in InfluxDB 3, you can use database tokens in InfluxDB 1.x username and password
schemes, in the InfluxDB v2 `Authorization: Token` scheme, or in the OAuth `Authorization: Bearer` scheme.

- [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
- [Authenticate with a token scheme](#authenticate-with-a-token-scheme)

### Authenticate with a username and password scheme

With InfluxDB v1-compatible endpoints, you can use the InfluxDB 1.x convention of
username and password to authenticate database reads and writes by passing a
[database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) as the `password` credential.
When authenticating requests to the v1 API `/write` and `/query` endpoints, {{% product-name %}} checks that the `password` (`p`) value is an authorized [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens).
{{% product-name %}} ignores the `username` (`u`) parameter in the request.

Use one of the following authentication schemes with clients that support Basic authentication or query parameters (that don't support [token authentication](#authenticate-with-a-token)):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to authenticate v1 API `/write` and `/query` requests.
When authenticating requests, {{% product-name %}} checks that the `password` part of the decoded credential is an authorized [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens).
{{% product-name %}} ignores the `username` part of the decoded credential.

##### Syntax

```http
Authorization: Basic <base64-encoded [USERNAME]:DATABASE_TOKEN>
```

Encode the `[USERNAME]:DATABASE_TOKEN` credential using base64 encoding, and then append the encoded string to the `Authorization: Basic` header.

{{% api/v1-compat/basic-auth-syntax %}}

##### Example

The following example shows how to use cURL with the `Basic` authentication
scheme and a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens):

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
#######################################
# Use Basic authentication with a database token
# to query the InfluxDB v1 API
#######################################


curl --get "https://{{< influxdb/host >}}/query" \
  --user "":"DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with sufficient permissions to the specified database

#### Query string authentication

In the URL, pass the `p` query parameter to authenticate `/write` and `/query` requests.
When authenticating requests, {{% product-name %}} checks that the `p` (_password_) value is an authorized database token and ignores the `u` (_username_) parameter.

##### Syntax

```http
https://{{< influxdb/host >}}/query/?[u=any]&p=DATABASE_TOKEN
https://{{< influxdb/host >}}/write/?[u=any]&p=DATABASE_TOKEN
```

##### Example

The following example shows how to use cURL with query string authentication and
[database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens).

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
#######################################
# Use an InfluxDB 1.x compatible username and password
# to query the InfluxDB v1 API
#######################################
# Use authentication query parameters:
#   ?p=DATABASE_TOKEN
#######################################

curl --get "https://{{< influxdb/host >}}/query" \
  --data-urlencode "p=DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with sufficient permissions to the specified database

### Authenticate with a token scheme

Use the `Authorization: Bearer` or the `Authorization: Token` scheme to pass a
[database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) for
authenticating v1 API `/write` and `/query` requests.

`Bearer` and `Token` are equivalent in {{% product-name %}}.
The `Token` scheme is used in the InfluxDB 2.x API.
`Bearer` is defined by the [OAuth 2.0 Framework](https://www.rfc-editor.org/rfc/rfc6750#page-14).
Support for one or the other may vary across InfluxDB API clients.

Include the word `Bearer` or `Token`, a space, and your **token** value (all case-sensitive).

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
{{% get-shared-text "api/cloud-dedicated/bearer-auth-v1-write.sh" %}}
```
{{% /code-placeholders %}}

Use `Token` to authenticate a write request:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
{{% get-shared-text "api/cloud-dedicated/token-auth-v1-write.sh" %}}
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) with
sufficient permissions to the specified database

## Responses

InfluxDB HTTP API responses use standard [HTTP status codes](/influxdb3/cloud-dedicated/api/#tag/Response-codes).
The response body for [partial writes](/influxdb3/cloud-dedicated/write-data/troubleshoot/#troubleshoot-rejected-points) and errors contains a JSON object with `code` and `message` properties that describe the error.
Response body messages may differ across {{% product-name %}} v1 API, v2 API, InfluxDB Cloud, and InfluxDB OSS.

### Error examples

- **Invalid namespace name**:

  ```http
  400 Bad Request
  ```
  
  ```json
  { "code":"invalid",
    "message":"namespace name length must be between 1 and 64 characters"
  }
  ```
  
  The `?db=` parameter value is missing in the request.
  Provide the [database](/influxdb3/cloud-dedicated/admin/databases/) name.
 

- **Failed to deserialize db/rp/precision**

    ```http
  400 Bad Request
  ```
  
  ```json
  { "code":"invalid",
    "message":"failed to deserialize db/rp/precision in request: unknown variant `u`, expected one of `s`, `ms`, `us`, `ns`"
  }
  ```
  
  The `?precision=` parameter contains an unknown value.
  Provide a [timestamp precision](#timestamp-precision).

## Write data

Write data with your existing workloads that already use the InfluxDB v1 or v1.x-compatibility `/write` API endpoint.

{{% api-endpoint endpoint="https://{{< influxdb/host >}}/write" method="post" %}}

- [`/api/v2/write` parameters](#v1-api-write-parameters)
- [Tools for writing to the v1 API](#tools-for-writing-to-the-v1-api)

#### v1 API /write parameters

For {{% product-name %}} v1 API `/write` requests, set parameters as listed in the following table:

Parameter              | Allowed in   | Ignored                  | Value
-----------------------|--------------|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`consistency`          | Query string | Ignored                  | N/A
`db` {{% req " \*" %}} | Query string | Honored                  | Database name
`precision`            | Query string | Honored                  | [Timestamp precision](#timestamp-precision)
`rp`                   | Query string | Honored, but discouraged | Retention policy
`u`                    | Query string | Ignored                  | For [query string authentication](#query-string-authentication), any arbitrary string
`p`                    | Query string | Honored                  | For [query string authentication](#query-string-authentication), a [database token](/influxdb3/cloud-dedicated/get-started/setup/#create-a-database-token) with permission to write to the database
`Content-Encoding`     | Header       | Honored                  | `gzip` (compressed data) or `identity` (uncompressed)
`Authorization`        | Header       | Honored                  | `Bearer DATABASE_TOKEN`, `Token DATABASE_TOKEN`, or `Basic <base64 [USERNAME]:DATABASE_TOKEN>`

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision

Use one of the following `precision` values in v1 API `/write` requests:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

### Tools for writing to the v1 API

The following tools work with the {{% product-name %}} `/write` endpoint:

- [Telegraf](#telegraf)
- [Interactive clients](#interactive-clients)
- [Client libraries](#client-libraries)

#### Telegraf

If you have existing v1 workloads that use Telegraf,
you can use the [InfluxDB v1.x `influxdb` Telegraf output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) to write data.

> [!Note]
> See how to [use Telegraf and the v2 API](/influxdb3/cloud-dedicated/write-data/use-telegraf/) for new workloads that don't already use the v1 API.

The following table shows `outputs.influxdb` plugin parameters and values for writing to the {{% product-name %}} v1 API: 

Parameter                | Ignored                  | Value
-------------------------|--------------------------|---------------------------------------------------------------------------------------------------
`database`               | Honored                  | Database name
`retention_policy`       | Honored, but discouraged | [Duration](/influxdb3/cloud-dedicated/reference/glossary/#duration)
`username`               | Ignored                  | String or empty
`password`               | Honored                  | [Database token](/influxdb3/cloud-dedicated/administration/tokens/#database-tokens) with permission to write to the database
`content_encoding`       | Honored                  | `gzip` (compressed data) or `identity` (uncompressed)
`skip_database_creation` | Ignored                  | N/A (see how to [create a database](/influxdb3/cloud-dedicated/admin/databases/create/))

To configure the v1.x output plugin for writing to {{% product-name %}}, add the following `outputs.influxdb` configuration in your `telegraf.conf` file:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```toml
[[outputs.influxdb]]
  urls = ["https://{{< influxdb/host >}}"]
  database = "DATABASE_NAME"
  skip_database_creation = true
  retention_policy = ""
  username = "ignored"
  password = "DATABASE_TOKEN"
  content_encoding = "gzip”
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with sufficient permissions to the specified database

##### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB 3.

For more plugin options, see [`influxdb`](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) on GitHub.

#### Interactive clients

To test InfluxDB v1 API writes interactively from the command line, use common HTTP clients such as cURL and Postman.

Include the following in your request:

- A `db` query string parameter with the name of the database to write to.
- A request body that contains a string of data in [line protocol](/influxdb3/cloud-dedicated/reference/syntax/line-protocol/) syntax.
- A [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) in
  one of the following authentication schemes: [Basic authentication](#basic-authentication), [query string authentication](#query-string-authentication), or [token authentication](#authenticate-with-a-token).
- Optional [parameters](#v1-api-write-parameters).

The following example shows how to use the **cURL** command line tool and the {{% product-name %}} v1 API to write line protocol data to a database:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
{{% influxdb/custom-timestamps %}}
```sh
curl -i 'https://{{< influxdb/host >}}/write?db=DATABASE_NAME&precision=s' \
    --header 'Authorization: Bearer DATABASE_TOKEN' \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1641024000'
```
{{% /influxdb/custom-timestamps %}}
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with sufficient permissions to the specified database

##### v1 CLI (not supported)

Don't use the v1 CLI with {{% product-name %}}.
While it may coincidentally work, it isn't officially supported.

#### Client libraries

Use language-specific [v1 client libraries](/influxdb/v1/tools/api_client_libraries/) and your custom code to write data to InfluxDB.
v1 client libraries send data in [line protocol](/influxdb3/cloud-dedicated/reference/syntax/line-protocol/) syntax to the v1 API `/write` endpoint.

The following samples show how to configure **v1** client libraries for writing to {{% product-name %}}:

{{< tabs-wrapper >}}
{{% tabs %}}
[Node.js](#nodejs)
[Python](#python)
{{% /tabs %}}
{{% tab-content %}}
<!-- Start NodeJS -->

Create a v1 API client using the [node-influx](/influxdb/v1/tools/api_client_libraries/#javascriptnodejs) JavaScript client library:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```js
const Influx = require('influx')

// Instantiate a client for writing to {{% product-name %}} v1 API
const client = new Influx.InfluxDB({
  host: '{{< influxdb/host >}}',
  port: 443,
  protocol: 'https'
  database: 'DATABASE_NAME',
  username: 'ignored',
  password: 'DATABASE_TOKEN'
})
```
{{% /code-placeholders %}}

<!-- End NodeJS -->
{{% /tab-content %}}
{{% tab-content %}}
<!-- Start Python -->

Create a v1 API client using the [influxdb-python](/influxdb/v1/tools/api_client_libraries/#python) Python client library:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
from influxdb import InfluxDBClient

# Instantiate a client for writing to {{% product-name %}} v1 API
client = InfluxDBClient(
  host='{{< influxdb/host >}}',
  ssl=True,
  database='DATABASE_NAME',
  username='',
  password='DATABASE_TOKEN'
  headers={'Content-Type': 'text/plain; charset=utf-8'}
  )
```
{{% /code-placeholders %}}

<!-- End Python -->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with sufficient permissions to the specified database

## Query data

{{% product-name %}} provides the following protocols for executing a query:

- [Flight+gRPC](https://arrow.apache.org/docs/format/Flight.html) request that contains an SQL or InfluxQL query.
  To learn how to query {{% product-name %}} using Flight and SQL, see the [Get started](/influxdb3/cloud-dedicated/get-started/) tutorial.
- InfluxDB v1 API `/query` request that contains an InfluxQL query. Use this endpoint with {{% product-name %}} when you bring InfluxDB 1.x workloads that already use [InfluxQL](/influxdb3/cloud-dedicated/reference/glossary/#influxql) and the v1 API `/query` endpoint.

> [!Note]
> #### Tools to execute queries
> 
> {{% product-name %}} supports many different tools for querying data, including:
> 
> - [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
> - [InfluxDB 3 client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/v3/)
> - [Flight clients](/influxdb3/cloud-dedicated/reference/client-libraries/flight/)
> - [Superset](/influxdb3/cloud-dedicated/query-data/sql/execute-queries/superset/)
> - [Grafana](/influxdb3/cloud-dedicated/query-data/sql/execute-queries/grafana/)
> - [InfluxQL with InfluxDB v1 HTTP API](/influxdb3/cloud-dedicated/query-data/execute-queries/influxdb-v1-api/)
> - [Chronograf](/chronograf/v1/)

### v1 API /query parameters

For {{% product-name %}} v1 API `/query` requests, set parameters as listed in the following table:

Parameter | Allowed in | Ignored | Value
----------|------------|---------|-------------------------------------------------------------------------
`chunked` | Query string | Honored | Returns points in streamed batches instead of in a single response. If set to `true`, InfluxDB chunks responses by series or by every 10,000 points, whichever occurs first.
`chunked_size` | Query string | Honored | **Requires `chunked` to be set to `true`**. If set to a specific value, InfluxDB chunks responses by series or by this number of points.
`db`        | Query string | Honored    | Database name                               |
`epoch`     | Query string | Honored    | [Timestamp precision](#timestamp-precision) |
`p` | Query string | Honored | Database token
`pretty` | Query string | Ignored | N/A
`u`                    | Query string | Ignored                  | For [query string authentication](#query-string-authentication), any arbitrary string
`p`                    | Query string | Honored                  | For [query string authentication](#query-string-authentication), a [database token](/influxdb3/cloud-dedicated/get-started/setup/#create-a-database-token) with permission to write to the database
`rp` | Query string | Honored, but discouraged | Retention policy

> [!Note]
> When bringing v1 API workloads to {{% product-name %}}, you'll need to adjust request parameters in your client configuration or code.

#### Timestamp precision

Use one of the following values for timestamp precision:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

### Database management with InfluxQL (not supported)

{{% product-name %}} doesn't allow InfluxQL commands for managing or modifying databases.
You can't use the following InfluxQL commands:

```sql
SELECT INTO
CREATE
DELETE
DROP
GRANT
EXPLAIN
REVOKE
ALTER
SET
KILL
```
