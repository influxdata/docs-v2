---
title: Use the InfluxDB v1 API
description: >
  Use InfluxDB v1 API authentication, endpoints, and tools when bringing existing 1.x workloads to InfluxDB Cloud Serverless.
weight: 3
menu:
  influxdb_cloud_serverless:
    parent: API compatibility
    name: v1 API
aliases:
  - /influxdb/cloud-serverless/primers/api/v1/
  - /influxdb/cloud-serverless/api-compatibility/v1/
influxdb/cloud-serverless/tags: [write, line protocol]
related:
  - /influxdb/cloud-serverless/query-data/sql/
  - /influxdb/cloud-serverless/query-data/influxql/
  - /influxdb/cloud-serverless/write-data/
  - /influxdb/cloud-serverless/write-data/use-telegraf/configure/
  - /influxdb/cloud-serverless/reference/api/
  - /influxdb/cloud-serverless/reference/client-libraries/
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
  - [Bucket management with InfluxQL not supported](#bucket-management-with-influxql-not-supported)

<!-- /TOC -->

## Authenticate API requests

{{% product-name %}} requires each API request to be authenticated with an
[API token](/influxdb/cloud-serverless/admin/tokens/).
With the InfluxDB v1 API, you can use API tokens in InfluxDB 1.x username and password
schemes or in the InfluxDB v2 `Authorization: Token` scheme.

- [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
- [Authenticate with a token scheme](#authenticate-with-a-token)

### Authenticate with a username and password scheme

With the InfluxDB v1 API, you can use the InfluxDB 1.x convention of
username and password to authenticate bucket reads and writes by passing an [API token](/influxdb/cloud-serverless/admin/tokens/) as the `password` credential.
When authenticating requests to the v1 API `/write` and `/query` endpoints, {{% product-name %}} checks that the `password` (`p`) value is an authorized [API token](/influxdb/cloud-serverless/admin/tokens/).
{{% product-name %}} ignores the `username` (`u`) parameter in the request.

Use one of the following authentication schemes with clients that support Basic authentication or query parameters (that don't support [token authentication](#authenticate-with-a-token)):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to authenticate v1 API `/write` and `/query` requests.
When authenticating requests, {{% product-name %}} checks that the `password` part of the decoded credential is an authorized [API token](/influxdb/cloud-serverless/admin/tokens/).
{{% product-name %}} ignores the `username` part of the decoded credential.

##### Syntax

```http
Authorization: Basic <base64-encoded [USERNAME]:API_TOKEN>
```

Encode the `[USERNAME]:DATABASE_TOKEN` credential using base64 encoding, and then append the encoded string to the `Authorization: Basic` header.

{{% api/v1-compat/basic-auth-syntax %}}

##### Example

The following example shows how to use cURL with the `Basic` authentication scheme and a [token](/influxdb/cloud-serverless/admin/tokens/):

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
#######################################
# Use Basic authentication with a database token
# to query the InfluxDB v1 API
#######################################

curl --get "https://{{< influxdb/host >}}/query" \
  --user "":"API_TOKEN" \
  --data-urlencode "db=BUCKET_NAME" \
  --data-urlencode "rp=RETENTION_POLICY" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} bucket
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: your {{% product-name %}} retention policy
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb/cloud-serverless/admin/tokens/) with sufficient permissions to the specified bucket

#### Query string authentication

In the URL, pass the `p` query parameter to authenticate `/write` and `/query` requests.
When authenticating requests, {{% product-name %}} checks that the `p` (_password_) value is an authorized API token and ignores the `u` (_username_) parameter.

##### Syntax

```sh
https://{{< influxdb/host >}}/query/?[u=any]&p=API_TOKEN
https://{{< influxdb/host >}}/write/?[u=any]&p=API_TOKEN
```

##### Example

The following example shows how to use cURL with query string authentication and a [token](/influxdb/cloud-serverless/admin/tokens/).

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
#######################################
# Use an InfluxDB 1.x compatible username and password
# to query the InfluxDB v1 API
#######################################

curl --get "https://{{< influxdb/host >}}/query" \
  --data-urlencode "p=API_TOKEN" \
  --data-urlencode "db=BUCKET_NAME" \
  --data-urlencode "rp=RETENTION_POLICY" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} bucket
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: your {{% product-name %}} retention policy
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb/cloud-serverless/admin/tokens/) with sufficient permissions to the specified bucket

### Authenticate with a token scheme

Use the `Authorization: Token` scheme to pass a [token](/influxdb/cloud-serverless/admin/tokens/) for authenticating
v1 API `/write` and `/query` requests.

#### Syntax

```http
Authorization: Token API_TOKEN
```

#### Examples

Use `Token` to authenticate a write request:

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
########################################################
# Use the Token authorization scheme with v1 /write
# to write data.
########################################################

curl -i "https://{{< influxdb/host >}}/write?db=BUCKET_NAME&rp=RETENTION_POLICY&precision=ms" \
    --header "Authorization: Token API_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1682358973500'
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} bucket
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: your {{% product-name %}} retention policy
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb/cloud-serverless/admin/tokens/) with sufficient permissions to the specified bucket

## Responses

InfluxDB API responses use standard HTTP status codes.
For successful writes, InfluxDB responds with a `204 No Content` status code.
Error responses contain a JSON object with `code` and `message` properties that describe the error.
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
  Provide the [bucket](/influxdb/cloud-serverless/admin/buckets/) name.
 

- **Failed to deserialize db/rp/precision**

    ```http
  400 Bad Request
  ```
  
  ```json
  { "code": "invalid",
    "message": "failed to deserialize db/rp/precision in request: unknown variant `u`, expected one of `s`, `ms`, `us`, `ns`"
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
`db` {{% req " \*" %}} | Query string | Honored                  | Bucket name
`precision`            | Query string | Honored                  | [Timestamp precision](#timestamp-precision)
`rp`                   | Query string | Honored                  | [Retention policy](#retention-policy-and-dbrp-mapping)
`u`                    | Query string | Ignored                  | For [query string authentication](#query-string-authentication), any arbitrary string
`p`                    | Query string | Honored                  | For [query string authentication](#query-string-authentication), a [token](/influxdb/cloud-serverless/admin/tokens/) with permission to write to the bucket
`Content-Encoding`     | Header       | Honored                  | `gzip` (compressed data) or `identity` (uncompressed)
`Authorization`        | Header       | Honored                  | `Token API_TOKEN`, or `Basic <base64 [USERNAME]:API_TOKEN>`

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision

Use one of the following `precision` values in v1 API `/write` requests:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

#### Retention policy and DBRP mapping

In {{< product-name >}}, databases and retention policies are
combined and replaced by InfluxDB [buckets](/influxdb/cloud-serverless/reference/glossary/#bucket).
Writing data with the InfluxDB v1 `/write` endpoint or querying data using InfluxQL requires first mapping a database retention policy (DBRP) combination to a bucket.
If you specify an existing DBRP in the `rp=` parameter or if a default DBRP exists for the bucket, InfluxDB writes to the specified bucket.

Otherwise, if no DBRP exists for the bucket specified in `db=BUCKET_NAME`, and you use an [All-Access API token](/influxdb/cloud-serverless/admin/tokens/#all-access-api-token) to authorize the write request, InfluxDB auto-generates a new bucket named `BUCKET_NAME/autogen` and a DBRP mapping named `autogen`, and then writes the data to the new bucket.

### Tools for writing to the v1 API

The following tools work with the {{% product-name %}} `/write` endpoint:

- [Telegraf](#telegraf)
- [Interactive clients](#interactive-clients)
- [Client libraries](#client-libraries)

#### Telegraf

If you have existing v1 workloads that use Telegraf,
you can use the [InfluxDB v1.x `influxdb` Telegraf output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) to write data.

{{% note %}}
See how to [use Telegraf and the v2 API](/influxdb/cloud-serverless/write-data/use-telegraf/) for new workloads that don't already use the v1 API.
{{% /note %}}

The following table shows `outputs.influxdb` plugin parameters and values for writing to the {{% product-name %}} v1 API: 

Parameter                | Ignored                  | Value
-------------------------|--------------------------|---------------------------------------------------------------------------------------------------
`database`               | Honored                  | Bucket name
`retention_policy`       | Honored | [Duration](/influxdb/cloud-serverless/reference/glossary/#duration)
`username`               | Ignored                  | String or empty
`password`               | Honored                  | [API token](/influxdb/cloud-serverless/admin/tokens/) with permission to write to the bucket
`content_encoding`       | Honored                  | `gzip` (compressed data) or `identity` (uncompressed)
`skip_database_creation` | Ignored                  | N/A (see how to [create a bucket](/influxdb/cloud-serverless/admin/buckets/create-bucket/))

To configure the v1.x output plugin for writing to {{% product-name %}}, add the following `outputs.influxdb` configuration in your `telegraf.conf` file:

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```toml
[[outputs.influxdb]]
  urls = ["https://{{< influxdb/host >}}"]
  database = "BUCKET_NAME"
  skip_database_creation = true
  retention_policy = "RETENTION_POLICY"
  username = "ignored"
  password = "API_TOKEN"
  content_encoding = "gzip”
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} bucket
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: your {{% product-name %}} retention policy
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb/cloud-serverless/admin/tokens/) with sufficient permissions to the specified bucket

##### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB IOx.

For more plugin options, see [`influxdb`](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) on GitHub.

#### Interactive clients

To test InfluxDB v1 API writes interactively from the command line, use common HTTP clients such as cURL and Postman.

Include the following in your request:

- A `db` query string parameter with the name of the bucket to write to.
- A request body that contains a string of data in [line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/) syntax.
- a [token](/influxdb/cloud-serverless/admin/tokens/) in one of the following authentication schemes: [Basic authentication](#basic-authentication), [query string authentication](#query-string-authentication), or [token authentication](#authenticate-with-a-token).
- Optional [parameters](#v1-api-write-parameters).

The following example shows how to use the **cURL** command line tool and the {{% product-name %}} v1 API to write line protocol data to a bucket:

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
curl -i "https://{{< influxdb/host >}}/write?db=BUCKET_NAME&rp=RETENTION_POLICY&precision=s" \
    --header "Authorization: Token API_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1463683075'
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} bucket
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: your {{% product-name %}} retention policy
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb/cloud-serverless/admin/tokens/) with sufficient permissions to the specified bucket

##### v1 CLI (not supported)

Don't use the v1 CLI with {{% product-name %}}.
While it may coincidentally work, it isn't officially supported.

#### Client libraries

Use language-specific [v1 client libraries](/influxdb/v1/tools/api_client_libraries/) and your custom code to write data to InfluxDB.
v1 client libraries send data in [line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/) syntax to the v1 API `/write` endpoint.

The following samples show how to configure **v1** client libraries for writing to {{% product-name %}}:

{{< tabs-wrapper >}}
{{% tabs %}}
[Node.js](#nodejs)
[Python](#python)
{{% /tabs %}}
{{% tab-content %}}
<!-- Start NodeJS -->

Create a v1 API client using the [node-influx](/influxdb/v1/tools/api_client_libraries/#javascriptnodejs) JavaScript client library:

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```js
const Influx = require('influx')

// Instantiate a client for writing to {{% product-name %}} v1 API
const client = new Influx.InfluxDB({
  host: '{{< influxdb/host >}}',
  port: 443,
  protocol: 'https'
  database: 'BUCKET_NAME',
  username: 'ignored',
  password: 'API_TOKEN'
})

// When calling write or query functions, specify the retention policy name in options.
```
{{% /code-placeholders %}}

<!-- End NodeJS -->
{{% /tab-content %}}
{{% tab-content %}}
<!-- Start Python -->

Create a v1 API client using the [influxdb-python](/influxdb/v1/tools/api_client_libraries/#python) Python client library:

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```py
from influxdb import InfluxDBClient

# Instantiate a client for writing to {{% product-name %}} v1 API
client = InfluxDBClient(
  host='{{< influxdb/host >}}',
  ssl=True,
  database='BUCKET_NAME',
  username='',
  password='API_TOKEN'
  headers={'Content-Type': 'text/plain; charset=utf-8'}
  )

# When calling write or query functions, specify the retention policy name in options.
```
{{% /code-placeholders %}}

<!-- End Python -->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} bucket
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: your {{% product-name %}} retention policy
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb/cloud-serverless/admin/tokens/) with sufficient permissions to the specified bucket

## Query data

{{% product-name %}} provides the following protocols for executing a query:

- [Flight+gRPC](https://arrow.apache.org/docs/format/Flight.html) request that contains an SQL or InfluxQL query.
  To learn how to query {{% product-name %}} using Flight and SQL, see the [Get started](/influxdb/cloud-serverless/get-started/) tutorial.
- InfluxDB v1 API `/query` request that contains an InfluxQL query. Use this endpoint with {{% product-name %}} when you bring InfluxDB 1.x workloads that already use [InfluxQL](/influxdb/cloud-serverless/reference/glossary/#influxql) and the v1 API `/query` endpoint.

{{% note %}}
#### Tools to execute queries

{{% product-name %}} supports many different tools for querying data, including:

- [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
- [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-serverless/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-serverless/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-serverless/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-serverless/query-data/execute-queries/influxdb-v1-api/)
- [Chronograf](/chronograf/v1/)
{{% /note %}}

### v1 API /query parameters

For {{% product-name %}} v1 API `/query` requests, set parameters as listed in the following table:

Parameter   | Allowed in   | Ignored | Value
------------|--------------|---------|-------------------------------------------------------------------------
`chunked`   |              | Ignored | N/A _(Note that an unbounded query might return a large amount of data)_
`db`        | Query string | Honored | Bucket name
`epoch`     | Query string | Honored | [Timestamp precision](#timestamp-precision)
`pretty`    | Query string | Ignored | N/A
`u`         | Query string | Ignored | For [query string authentication](#query-string-authentication), any arbitrary string
`p`         | Query string | Honored | For [query string authentication](#query-string-authentication), a [token](/influxdb/cloud-serverless/admin/tokens) with permission to write to the bucket
`rp`        | Query string | Honored | Retention policy

{{% note %}}
When bringing v1 API workloads to {{% product-name %}}, you'll need to adjust request parameters in your client configuration or code.
{{% /note %}}

#### Timestamp precision

Use one of the following values for timestamp precision:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

### Bucket management with InfluxQL (not supported)

{{% product-name %}} doesn't allow InfluxQL commands for managing or modifying buckets.
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
