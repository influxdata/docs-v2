---
title: Use the InfluxDB v1 API with InfluxDB Cloud Dedicated
list_title: Use the InfluxDB v1 API
description: >
  Use InfluxDB v1 API authentication, endpoints, and tools.
  Learn how to use v1 `/query`, `/write`, and username/password authentication  when bringing existing 1.x workloads to InfluxDB Cloud Dedicated.
weight: 3
menu:
  influxdb_cloud_dedicated:
    parent: API primers
    name: v1 API primer
influxdb/cloud-dedicated/tags: [write, line protocol]
---

Use the InfluxDB v1 API when you have existing v1 workloads already using it.
The v1 `/write` and `/query` endpoints work with username/password authentication, existing InfluxDB 1.x tools, and your custom code.

{{% warn %}}
{{% api/cloud/v2-prefer %}}
{{% /warn %}}

The InfluxDB v1 API `/write` endpoint works with
InfluxDB 1.x client libraries and the [Telegraf v1 Output Plugin](/telegraf/v1.26/plugins/#output-influxdb).

The InfluxDB v1 API `/query` endpoint supports InfluxQL and third-party integrations like [Grafana](https://grafana.com).

<!--
<a class="btn" href="/influxdb/cloud-dedicated/api/v1/">View v1 API reference documentation</a>
-->

## Authenticate API requests

InfluxDB requires each write request to be authenticated with a
[database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token).
With the InfluxDB v1 API, you can use Database Tokens in InfluxDB 1.x username and password
schemes or in the InfluxDB v2 `Authorization: Token` scheme:

- [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
- [Authenticate using the Authorization Token scheme](#authenticate-with-the-token-scheme)


### Authenticate with a username and password scheme

With the InfluxDB v1 API, you can use the InfluxDB 1.x convention of username and password to authenticate database reads and writes by passing a [Database Token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) as the `password` credential.
When authenticating requests to the v1 API `/write` and `/query` endpoints, InfluxDB Cloud checks that `password` is an authorized Database Token and ignores `username`.

Use one of the following authentication schemes with clients that support Basic authentication or query parameters (that don't support the `Authorization: Token` scheme):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to authenticate v1 API `/write` and `/query` requests.
When authenticating requests, InfluxDB Cloud checks that `password` is an authorized Database Token and ignores `username`.

##### Syntax

```http
Authorization: Basic <base64-encoded [USERNAME]:DATABASE_TOKEN>
```

Replace the following:

- **`[USERNAME]`**: any value or leave empty. InfluxDB Cloud Dedicated ignores this part of the credentials.
- **`DATABASE_TOKEN`**: a [Database Token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token).
- Encode the `[USERNAME]:DATABASE_TOKEN` credentials using base64 encoding, and then append the encoded string to the `Authorization: Basic` header.

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

- *`DATABASE_TOKEN`*: a [Database Token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) with sufficient permissions to the database.

#### Query string authentication

Use the `p` query parameter to authenticate `/write` and `/query` requests.
When authenticating requests, InfluxDB Cloud checks that `p` is an authorized Database Token and ignores the `u` parameter.

{{% warn %}}
##### Consider when using query string parameters

- URL-encode query parameters that may contain whitespace or other special characters.
- Be aware of the [risks](https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url) when exposing sensitive data through URLs.
{{% /warn %}}

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

- **`DATABASE_TOKEN`**: a [Database Token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) with sufficient permissions to the database.

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

### Write data using Telegraf

If have existing v1 workloads that use Telegraf,
you can use the [InfluxDB v1.x `outputs.influxdb` plugin](https://github.com/influxdata/telegraf/blob/release-1.26/plugins/outputs/influxdb/README.md) to write data.
In order to write data to InfluxDB Cloud Dedicated, you'll need to
make the following changes to your `outputs.influxdb` configuration:

Parameter          | Ignored                  | Value
-------------------|--------------------------|------------------------------------------------------------
`database`         | Honored                  | Database name
`retention_policy` | Honored, but discouraged | [Duration](/influxdb/cloud-iox/reference/glossary/#duration)
`username`         | Ignored                  | Any string or empty
`password`         | Honored                  | [Database token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) with permission to write to the database
`content_encoding`       | Honored                    | `gzip` (compressed) or `identity` (uncompressed)
`skip_database_creation` | Ignored                    | N/A ([contact Support]() to create a database)

The following sample shows how to configure the `outputs.influxdb` Telegraf plugin for InfluxDB Cloud Dedicated:

```toml
[[outputs.influxdb]]
  urls = ["http://localhost:8086"]
  database = "DATABASE_NAME"
  skip_database_creation = true
  retention_policy = ""
  username = ""
  password = "DATABASE_TOKEN"
  content_encoding = "gzip”
```

Replace the following:

- **`DATABASE_NAME`**: your InfluxDB Cloud Dedicated database
- **`DATABASE_TOKEN`**: a [Database Token](/influxdb/cloud-dedicated/get-started/setup/#create-a-database-token) with permission to write to the database

#### Other Telegraf configuration options

`influx_uint_support`: supported in InfluxDB IOx.

### Write data using v1 client libraries

### Write data using v1 API /write

Use HTTP clients and your custom code to send write requests to the v1 API `/write` endpoint.

{{% api-endpoint endpoint="http://localhost:8086/write" method="post"%}}

#### v1 API /write parameters

Parameter     | Allowed in   | Ignored | Value
--------------|--------------|---------|------------------------------------------------------------
`consistency` | Query string | Ignored | N/A
`db`          | Query string | Honored | Database name
`precision`   | Query string | Honored | [Timestamp precision](#timestamp-precision): `ns`, `u`, `ms`, `s`, `m`, `h`
`rp`          | Query string | Honored | Honored, but discouraged
`u`           | Query string | Ignored | Any string or empty
`p`           | Query string | Honored | [Database token]() with permission to write to the database
`Content-Encoding` | Header      | Honored | `gzip` (compressed) or `identity` (uncompressed)
`Authorization`    | Header      | Honored | `Token DATABASE_TOKEN` | `Basic <base64 [username]:DATABASE_TOKEN>`

#### Timestamp precision

Use one of the following `precision` values in v1 API `/write` requests:

- `ns`: nanoseconds
- `u`: microseconds <!-- @TODO: test that differs from `us` used in v2?? -->
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

### Write data using HTTP clients

To test interactively, use common HTTP clients such as cURL and Postman to send requests to the v1 API `/write` endpoint.

{{% warn %}}
While the v1 CLI may coincidentally work with {{% cloud-name %}}, it isn't supported.
{{% /warn %}}

The following example shows to use the **cURL** command line tool to write line protocol data to an InfluxDB Cloud database:

```sh
curl -i http://localhost:8086/write?db=DATABASE_NAME&precision=s \
    --header 'Authorization: Token DATABASE_TOKEN' \
    --data-binary 'home,room=kitchen temp=72 1463683075'
```

### v1 CLI (not supported)

Don't use the v1 CLI for writing data to {{% cloud-name %}}.
While the v1 CLI may coincidentally work with {{% cloud-name %}}, it isn't supported.

If you need to test writes interactively, see how to [write data using HTTP clients](#write-data-using-http-clients).
