---
title: Use the InfluxDB v1 API with InfluxDB Cloud Dedicated
list_title: Use the InfluxDB v1 API
description: >
  Use InfluxDB v1 API authentication, endpoints, and tools.
  Learn how to use v1 `/query`, `/write`, and username/password authentication when bringing existing 1.x workloads to InfluxDB Cloud Dedicated.
weight: 3
menu:
  influxdb_cloud_dedicated:
    parent: API primers
    name: v1 API primer
influxdb/cloud-dedicated/tags: [write, line protocol]
---

Use the InfluxDB v1 API with v1 workloads that you bring to InfluxDB Cloud Dedicated.
InfluxDB Cloud Dedicated v1 `/write` and `/query` endpoints work with username/password authentication and existing InfluxDB 1.x tools and code.
The InfluxDB v1 API `/write` endpoint works with
InfluxDB 1.x client libraries and the [Telegraf v1 Output Plugin](/telegraf/v1.26/plugins/#output-influxdb).
The InfluxDB v1 API `/query` endpoint supports InfluxQL and third-party integrations like [Grafana](https://grafana.com).

{{% warn %}}
{{% api/cloud/v2-prefer %}}
{{% /warn %}}

<!-- TOC -->

- [Authenticate API requests](#authenticate-api-requests)
  - [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
  - [Authenticate with the Token scheme](#authenticate-with-the-token-scheme)
- [Write data with the v1 API](#write-data-with-the-v1-api)
  - [Write using Telegraf](#write-using-telegraf)
  - [Write using client libraries](#write-using-client-libraries)
  - [Write using HTTP clients](#write-using-http-clients)
  - [v1 CLI not supported](#v1-cli-not-supported)
- [Query data](#query-data)
<!--
<a class="btn" href="/influxdb/cloud-dedicated/api/v1/">View v1 API reference documentation</a>
-->

## Authenticate API requests

InfluxDB requires each write request to be authenticated with a
[database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token).
With the InfluxDB v1 API, you can use database tokens in InfluxDB 1.x username and password
schemes or in the InfluxDB v2 `Authorization: Token` scheme:

- [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
- [Authenticate using the Authorization Token scheme](#authenticate-with-the-token-scheme)

### Authenticate with a username and password scheme

With the InfluxDB v1 API, you can use the InfluxDB 1.x convention of
username and password to authenticate database reads and writes by passing a
[database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token)
as the `password` credential.
When authenticating requests to the v1 API `/write` and `/query` endpoints, InfluxDB Cloud Dedicated checks that `password` (`p`) is an authorized [database token](/influxdb/cloud-dedicated/admin/tokens/).
InfluxDB Cloud ignores the `username` (`u`) parameter in the request.

Use one of the following authentication schemes with clients that support Basic authentication or query parameters (that don't support the [`Authorization: Token` scheme](#authenticate-with-the-token-scheme)):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to authenticate v1 API `/write` and `/query` requests.
When authenticating requests, InfluxDB Cloud Dedicated checks that the `password` part of the decoded credential is an authorized [database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token).
InfluxDB Cloud Dedicated ignores the `username` part of the decoded credential.

##### Syntax

```http
Authorization: Basic <base64-encoded [USERNAME]:DATABASE_TOKEN>
```

Replace the following:

- **`[USERNAME]`**: an optional string value (ignored by InfluxDB Cloud Dedicated).
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/).
- Encode the `[USERNAME]:DATABASE_TOKEN` credential using base64 encoding, and then append the encoded string to the `Authorization: Basic` header.

{{% api/v1-compat/basic-auth-syntax %}}

##### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

With an empty username:

```sh
{{% get-shared-text "api/cloud-dedicated/basic-auth.sh" %}}
```
{{% /code-tab-content %}}

{{% code-tab-content %}}

With an empty username:

```js
{{% get-shared-text "api/cloud-dedicated/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

#### Query string authentication

In the URL, pass the `p` query parameter to authenticate `/write` and `/query` requests.
When authenticating requests, InfluxDB Cloud Dedicated checks that `p` (_password_) is an authorized database token and ignores the `u` (_username_) parameter.

##### Syntax

```sh
https://cloud2.influxdata.com/query/?[u=any]&p=DATABASE_TOKEN
https://cloud2.influxdata.com/write/?[u=any]&p=DATABASE_TOKEN
```

##### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

With an empty username:

```sh
{{% get-shared-text "api/cloud-dedicated/querystring-auth.sh" %}}
```
{{% /code-tab-content %}}

{{% code-tab-content %}}

With an empty username:

```js
{{% get-shared-text "api/cloud-dedicated/querystring-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

### Authenticate with the Token scheme

Use the `Authorization` header with the `Token` scheme to authenticate `/write` and `/query` requests.

#### Syntax

```http
Authorization: Token DATABASE_TOKEN
```

#### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-shared-text "api/cloud-dedicated/token-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-shared-text "api/cloud-dedicated/token-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!-- ## Responses -->

## Write data with the v1 API

Write data with your existing workloads that already use the InfluxDB v1 API or v1.x-compatibility API.

See parameter differences in InfluxDB Cloud Dedicated v1 API and how to configure writes using the following tools:

- [Write using Telegraf](#write-data-using-telegraf)
- [Write using client libraries](#write-data-using-v1-client-libraries)
- [Write using HTTP clients](#write-using-http-clients)

### Write using Telegraf

If have existing v1 workloads that use Telegraf,
you can use the [InfluxDB v1.x `outputs.influxdb` plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) to write data.
To configure the v1.x output plugin for writing to InfluxDB Cloud Dedicated,
make the following changes to your `outputs.influxdb` configuration:

Parameter                | Ignored                  | Value
-------------------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------
`database`               | Honored                  | Database name
`retention_policy`       | Honored, but discouraged | [Duration](/influxdb/cloud-iox/reference/glossary/#duration)
`username`               | Ignored                  | String or empty
`password`               | Honored                  | [Database token](/influxdb/cloud-dedicated/admin/tokens/) with permission to write to the database
`content_encoding`       | Honored                  | `gzip` (compressed data) or `identity` (uncompressed)
`skip_database_creation` | Ignored                  | N/A (see how to [create a database](/influxdb/cloud-dedicated/admin/databases/create/))

The following sample shows how to configure the `outputs.influxdb` Telegraf plugin for InfluxDB Cloud Dedicated:

```toml
[[outputs.influxdb]]
  urls = ["https://cloud2.influxdata.com"]
  database = "DATABASE_NAME"
  skip_database_creation = true
  retention_policy = ""
  username = ""
  password = "DATABASE_TOKEN"
  content_encoding = "gzip”
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) with permission to write to the database

#### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB IOx.

### Write using client libraries

Use language-specific [v1 client libraries](/influxdb/v1.7/tools/api_client_libraries/) to write data to InfluxDB Cloud Dedicated.
v1 client libraries send data in [line protocol](/influxdb/cloud-iox/reference/syntax/line-protocol/) syntax to the v1 API `/write` endpoint.

The following samples show how to configure **v1 client libraries** for writing to InfluxDB Cloud Dedicated.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- Start NodeJS -->

Instantiate a [node-influx](/influxdb/v1.7/tools/api_client_libraries/#javascriptnodejs) client for writing to InfluxDB Cloud Dedicated v1 API:

```js
const Influx = require('influx')

// Instantiate a client for writing to InfluxDB Cloud Dedicated v1 API
const client = new Influx.InfluxDB({
  host: 'cloud2.influxdata.com',
  port: 443,
  protocol: 'https'
  database: 'DATABASE_NAME',
  username: '',
  password: 'DATABASE_TOKEN'
})
```
<!-- End NodeJS -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- Start Python -->

Instantiate an [influxdb-python](/influxdb/v1.7/tools/api_client_libraries/#python) client for writing to the InfluxDB Cloud Dedicated v1 API:

```py
from influxdb import InfluxDBClient

# Instantiate a client for writing to InfluxDB Cloud Dedicated v1 API
client = InfluxDBClient(
  host='cloud2.influxdata.com',
  ssl=True,
  database='DATABASE_NAME',
  username='',
  password='DATABASE_TOKEN')
```
<!-- End Python -->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

### Write using HTTP clients

Use HTTP clients and your custom code to send write requests to the v1 API `/write` endpoint.

{{% api-endpoint endpoint="https://cloud2.influxdata.com/write" method="post"%}}

Include the following in your request:

- A `db` query string parameter with the name of the database to write to.
- A request body that contains a string of data in [line protocol](/influxdb/cloud-iox/reference/syntax/line-protocol/) syntax.
- A [database token](/influxdb/cloud-dedicated/admin/tokens/) in one of the following authentication schemes: [Basic authentication](#basic-authentication), [query string authentication](#query-string-authentication), or [`Token` authentication](#authenticate-with-the-token-scheme).
- Optional [parameters](#v1-api-write-parameters).

#### v1 API /write parameters

Parameter              | Allowed in   | Ignored | Value
-----------------------|--------------|---------|---------------------------------------------------------------------------------------------------
`consistency`          | Query string | Ignored | N/A
`db` {{% req " \*" %}} | Query string | Honored | Database name
`precision`            | Query string | Honored | [Timestamp precision](#timestamp-precision): `ns`, `u`, `ms`, `s`, `m`, `h` <!-- default? ns? -->
`rp`                   | Query string | Honored | Honored, but discouraged
`u`                    | Query string | Ignored | String or empty
`p`                    | Query string | Honored | For [query string authentication](#query-string-authentication), a [database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) with permission to write to the database
`Content-Encoding`     | Header       | Honored | `gzip` (compressed data) or `identity` (uncompressed)
`Authorization`    | Header      | Honored | `Token DATABASE_TOKEN` or `Basic <base64 [USERNAME]:DATABASE_TOKEN>`

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision

Use one of the following `precision` values in v1 API `/write` requests:

- `ns`: nanoseconds
- `u`: microseconds <!-- @TODO: test that differs from `us` used in v2?? -->
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

#### Write data using interactive clients

To test interactively, use common HTTP clients such as cURL and Postman to send requests to the v1 API `/write` endpoint.

{{% warn %}}
While the v1 CLI may coincidentally work with InfluxDB Cloud Dedicated, it isn't officially supported.
{{% /warn %}}

The following example shows how to use the **cURL** command line tool to write line protocol data to an InfluxDB Cloud Dedicated database:

```sh
curl -i http://localhost:8086/write?db=DATABASE_NAME&precision=s \
    --header 'Authorization: Token DATABASE_TOKEN' \
    --data-binary 'home,room=kitchen temp=72 1463683075'
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

### v1 CLI (not supported)

Don't use the v1 CLI for writing data to {{% cloud-name %}}.
While the v1 CLI may coincidentally work with {{% cloud-name %}}, it isn't supported.

If you need to test writes interactively, see how to [write using HTTP clients](#write-using-http-clients).

## Query data

### Query using the v1 API

Use the v1 API `/query` endpoint with InfluxDB Cloud Dedicated when you 
bring v1 workloads that already use the v1 API and InfluxQL.

### Query using Flight SQL

Use Flight SQL clients and SQL to query data stored in an InfluxDB Cloud Dedicated database.
