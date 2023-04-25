---
title: Use the InfluxDB v1 API with InfluxDB Cloud Dedicated
list_title: Use the InfluxDB v1 API
description: >
  Use InfluxDB v1 API authentication, endpoints, and tools.
  Learn how to use InfluxDB Cloud Dedicated v1 `/query`, `/write`, and username/password authentication when bringing existing 1.x workloads.
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

The following example shows how to use cURL with the `Basic` authentication scheme and a [database token](/influxdb/cloud-dedicated/admin/tokens/):

```sh
{{% get-shared-text "api/cloud-dedicated/basic-auth.sh" %}}
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

#### Query string authentication

In the URL, pass the `p` query parameter to authenticate `/write` and `/query` requests.
When authenticating requests, InfluxDB Cloud Dedicated checks that `p` (_password_) is an authorized database token and ignores the `u` (_username_) parameter.

##### Syntax

```sh
https://cluster-id.influxdb.io/query/?[u=any]&p=DATABASE_TOKEN
https://cluster-id.influxdb.io/write/?[u=any]&p=DATABASE_TOKEN
```

##### Example

The following example shows how to use cURL with query string authentication and [database token](/influxdb/cloud-dedicated/admin/tokens/).

```sh
{{% get-shared-text "api/cloud-dedicated/querystring-auth.sh" %}}
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

### Authenticate with the Token scheme

Use the `Authorization` header with the `Token` scheme to authenticate v1 API requests.

#### Syntax

```http
Authorization: Token DATABASE_TOKEN
```

#### Example

The following example shows how to use cURL with the `Token` authentication scheme and a [database token](/influxdb/cloud-dedicated/admin/tokens/):

```sh
{{% get-shared-text "api/cloud-dedicated/token-auth.sh" %}}
```

<!-- ## Responses -->

## Write data with the v1 API

Write data with your existing workloads that already use the InfluxDB v1 API or v1.x-compatibility API.

See how to set parameters and configure the following tools for writing to InfluxDB Cloud Dedicated:

- [Write using Telegraf](#write-using-telegraf)
- [Write using client libraries](#write-using-client-libraries)
- [Write using HTTP clients](#write-using-http-clients)
  - [v1 API /write parameters](#v1-api-write-parameters)
  - [Use clients for interactive testing](#use-clients-for-interactive-testing)

### Write using Telegraf

If you have existing v1 workloads that use Telegraf,
you can use the [InfluxDB v1.x `influxdb` Telegraf output plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) to write data.

{{% warn %}}
Use [Telegraf and the v2 API](/influxdb/cloud-dedicated/primers/api/v2/) for new workloads that don't use already use the v1 API.
{{% /warn %}}

The following table shows `outputs.influxdb` parameters and values writing
to InfluxDB Cloud Dedicated: 

Parameter                | Ignored                  | Value
-------------------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------
`database`               | Honored                  | Database name
`retention_policy`       | Honored, but discouraged | [Duration](/influxdb/cloud-dedicated/reference/glossary/#duration)
`username`               | Ignored                  | String or empty
`password`               | Honored                  | [Database token](/influxdb/cloud-dedicated/admin/tokens/) with permission to write to the database
`content_encoding`       | Honored                  | `gzip` (compressed data) or `identity` (uncompressed)
`skip_database_creation` | Ignored                  | N/A (see how to [create a database](/influxdb/cloud-dedicated/admin/databases/create/))

To configure the v1.x output plugin for writing to InfluxDB Cloud Dedicated,
add the following `outputs.influxdb` configuration in your `telegraf.conf` file:

```toml
[[outputs.influxdb]]
  urls = ["https://cluster-id.influxdb.io"]
  database = "DATABASE_NAME"
  skip_database_creation = true
  retention_policy = ""
  username = "ignored"
  password = "DATABASE_TOKEN"
  content_encoding = "gzip”
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) with permission to write to the database

#### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB IOx.

For more plugin options, see [`influxdb`](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/influxdb/README.md) on GitHub.

### Write using client libraries

Use language-specific [v1 client libraries](/influxdb/v1.8/tools/api_client_libraries/) and your custom code to write data to InfluxDB Cloud Dedicated.
v1 client libraries send data in [line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/) syntax to the v1 API `/write` endpoint.

The following samples show how to configure **v1** client libraries for writing to InfluxDB Cloud Dedicated:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- Start NodeJS -->

Create a v1 API client using the [node-influx](/influxdb/v1.7/tools/api_client_libraries/#javascriptnodejs) JavaScript client library:

```js
const Influx = require('influx')

// Instantiate a client for writing to InfluxDB Cloud Dedicated v1 API
const client = new Influx.InfluxDB({
  host: 'cluster-id.influxdb.io',
  port: 443,
  protocol: 'https'
  database: 'DATABASE_NAME',
  username: 'ignored',
  password: 'DATABASE_TOKEN'
})
```
<!-- End NodeJS -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- Start Python -->

Create a v1 API client using the [influxdb-python](/influxdb/v1.7/tools/api_client_libraries/#python) Python client library:

```py
from influxdb import InfluxDBClient

# Instantiate a client for writing to InfluxDB Cloud Dedicated v1 API
client = InfluxDBClient(
  host='cluster-id.influxdb.io',
  ssl=True,
  database='DATABASE_NAME',
  username='',
  password='DATABASE_TOKEN'
  headers={'Content-Type': 'text/plain; charset=utf-8'}
  )
```
<!-- End Python -->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

### Write using HTTP clients

Use HTTP clients and your custom code to send write requests to the v1 API `/write` endpoint.

{{% api-endpoint endpoint="https://cluster-id.influxdb.io/write" method="post"%}}

Include the following in your request:

- A `db` query string parameter with the name of the database to write to.
- A request body that contains a string of data in [line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/) syntax.
- A [database token](/influxdb/cloud-dedicated/admin/tokens/) in one of the following authentication schemes: [Basic authentication](#basic-authentication), [query string authentication](#query-string-authentication), or [`Token` authentication](#authenticate-with-the-token-scheme).
- Optional [parameters](#v1-api-write-parameters).

#### v1 API /write parameters

Parameter              | Allowed in   | Ignored | Value
-----------------------|--------------|---------|---------------------------------------------------------------------------------------------------
`consistency`          | Query string | Ignored | N/A
`db` {{% req " \*" %}} | Query string | Honored | Database name
`precision`            | Query string | Honored | [Timestamp precision](#timestamp-precision): `ns`, `u`, `ms`, `s`, `m`, `h` <!-- default? ns? -->
`rp`                   | Query string | Honored | Honored, but discouraged
`u`                    | Query string | Ignored | String
`p`                    | Query string | Honored | For [query string authentication](#query-string-authentication), a [database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) with permission to write to the database
`Content-Encoding`     | Header       | Honored | `gzip` (compressed data) or `identity` (uncompressed)
`Authorization`        | Header       | Honored | `Token DATABASE_TOKEN` or `Basic <base64 [USERNAME]:DATABASE_TOKEN>`

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision

Use one of the following `precision` values in v1 API `/write` requests:

- `ns`: nanoseconds
- `u`: microseconds <!-- @TODO: test that differs from `us` used in v2?? -->
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

#### Use clients for interactive testing

To test interactively, use common HTTP clients such as cURL and Postman to send requests to the v1 API `/write` endpoint.

{{% warn %}}
While the v1 CLI may coincidentally work with InfluxDB Cloud Dedicated, it isn't officially supported.
{{% /warn %}}

The following example shows how to use the **cURL** command line tool and the InfluxDB Cloud Dedicated v1 API to write line protocol data to a database:

```sh
curl -i 'https://cluster-id.influxdb.io/write?db=DATABASE_NAME&precision=s' \
    --header 'Authorization: Token DATABASE_TOKEN' \
    --header "Content-type: text/plain; charset=utf-8"
    --data-binary 'home,room=kitchen temp=72 1463683075'
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

### v1 CLI (not supported)

Don't use the v1 CLI with {{% cloud-name %}}.
While it may coincidentally work, it isn't officially supported.

If you need to test writes interactively, see how to [write using HTTP clients](#write-using-http-clients).

## Query data

### Query using the v1 API

Use the v1 API `/query` endpoint and InfluxQL with InfluxDB Cloud Dedicated when you 
bring InfluxDB 1.x workloads that already use them.

For new workloads, see how to [query using Flight SQL](#query-using-flight-sql).

### Query using Flight SQL

Use Flight SQL clients with gRPC and SQL to query data stored in an InfluxDB Cloud Dedicated database.
