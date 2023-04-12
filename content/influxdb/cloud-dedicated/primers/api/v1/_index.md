---
title: Use the InfluxDB v1 API with InfluxDB Cloud Dedicated (Single-tenant)
list_title: Use the InfluxDB v1 API
description: >
  Use InfluxDB v1 API authentication, endpoints, and tools with InfluxDB Cloud Dedicated (Single-tenant).
  Use the v1 API when you have existing v1 workloads that need it.
weight: 3
menu:
  influxdb_cloud_dedicated:
    parent: API primers
    name: v1 API primer
influxdb/cloud-dedicated/tags: [write, line protocol]
---

Use the InfluxDB v1 API when you have existing v1 workloads that need it.
`/write` and `/query` endpoints 
Write data using the v1 `/write` endpoint with the Telegraf v1 Output Plugin or your existing code.
Query InfluxDB databases using the v1 `/query` endpoint with tools like Grafana, pandas, and your custom code.

{{% note %}}
{{% api/cloud/v2-prefer %}}
{{% /note %}}

<!-- v1 SAMPLE CODE -->

The InfluxDB v1 API `/write` endpoint works with
InfluxDB 1.x client libraries and the Telegraf v1 Output Plugin.

The InfluxDB v1 API `/query` endpoint uses SQL and works with Flight SQL libraries and plugins,
and third-party integrations like [Grafana](https://grafana.com).

<a class="btn" href="/influxdb/cloud-dedicated/api/v1/">View full v1 API documentation</a>

## Authenticate API requests

InfluxDB requires each write request to be authenticated with a
[Database Token](/influxdb/cloud-dedicated/get-started/setup/).

You can use Database Tokens in the following authentication methods:

- [Authenticate using the Authorization Token scheme](#authenticate-with-the-token-scheme)
- [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)

### Authenticate using the Authorization Token scheme

Use the `Authorization` header with the `Token` scheme to provide your token to InfluxDB.
As with [v2 API endpoints](/influxdb/cloud-dedicated/), include your Database Token in an `Authorization: Token DATABASE_TOKEN` HTTP header with each request.


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
{{% get-shared-text "api/v1-compat/auth/oss/token-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/oss/token-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Authenticate with a username and password scheme

With InfluxDB Cloud Dedicated, you can use username and password authentication by passing a [Database Token](/influxdb/cloud-dedicated/get-started/setup/) as the `password` credential.
When authenticating the request, InfluxDB Cloud Dedicated checks that the `password` is an authorized Database Token and ignores the `username` value.

Use the following authentication schemes with clients that support the InfluxDB 1.x convention of `username` and `password` (that don't support the `Authorization: Token` scheme):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to provide username and
password credentials to InfluxDB.

##### Syntax

```http
Authorization: Basic BASE64_ENCODED_CREDENTIALS
```

Replace the following:

- *`BASE64_ENCODED_CREDENTIALS`*: base64-encoded `username:DATABASE_TOKEN`
  - *`username`*: any value or leave empty. InfluxDB Cloud Dedicated ignores this part of the credential.
  - *`DATABASE_TOKEN`*: [Database Token](/influxdb/cloud-dedicated/get-started/setup/).
  - Use a colon `:` to separate username and password.
  - Encode the `username:DATABASE_TOKEN` credentials using base64 encoding.

{{% api/v1-compat/basic-auth-syntax %}}

##### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
{{% get-shared-text "api/v1-compat/auth/cloud-dedicated/basic-auth.sh" %}}
```

With an empty username:

```http
:DATABASE_TOKEN
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/cloud-dedicated/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:
- *`username`*: any value or leave empty
- *`DATABASE_TOKEN`*: [Database Token](/influxdb/cloud-dedicated/get-started/setup/).

#### Query string authentication

Use InfluxDB v1 API parameters to provide credentials through the query string.

{{% note %}}
##### Consider when using query string parameters

- URL-encode query parameters that may contain whitespace or other special characters.
- Be aware of the [risks](https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url) when exposing sensitive data through URLs.
{{% /note %}}

##### Syntax

```sh
https://cloud2.com/query/?[u=any]&p=DATABASE_TOKEN
https://cloud2.com/write/?[u=any]&p=DATABASE_TOKEN
```

##### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-shared-text "api/v1-compat/auth/cloud-dedicated/querystring-auth.sh" %}}
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/cloud-dedicated/querystring-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:
- *`username`*: any value or leave empty
- *`DATABASE_TOKEN`*: a [Database Token](/influxdb/cloud-dedicated/get-started/setup/) that has permissions to the database
 
## Responses

## Use Telegraf with the v1 API write endpoint

## Use the v1 API /write endpoint

{{% api-endpoint endpoint="/write" method="post"%}}

### v1 API /write parameters

Name               | Allowed in  | Ignored | Value
-------------------|-------------|---------|----------------------------------------------------------------------------------
`db`               | Query param | Honored | Database name
`precision`        | Query param | Honored | One of `n`,`u`,`ms`,`s`,`m`,`h`
`rp`               | Query param | Honored | Honored, but discouraged
`u`                | Query param | Ignored | Any value or empty
`p`                | Query param | Honored | Database token
`Content-Encoding` | Header      | Honored | `gzip` (compressed) | `identity` (uncompressed)
`Authorization`    | Header      | Honored | `Token DATABASE_TOKEN` | `Basic <base64 [username]:DATABASE_TOKEN>`

### Use the v1 API with HTTP clients and custom code

{{% warn %}}
While the v1 CLI may coincidentally work with {{% cloud-name %}}, it isn't supported.
{{% /warn %}}

To test API writes interactively, use common HTTP clients such as cURL and Postman to send requests to the v1 API `/write` endpoint.

The following example shows to use cURL to write line protocol to the v1 API:

```sh
curl -i https://cloud2.influxdata.com/write?db=DATABASE_NAME&precision=s \
    --header 'Authorization: Token DATABASE_TOKEN' \
    --data-binary 'home,room=kitchen temp=72 1463683075'
```

### v1 CLI (not supported)

Don't use the v1 CLI for writing data to {{% cloud-name %}}.
While the v1 CLI may coincidentally work with {{% cloud-name %}}, it isn't supported.

If you need to test writes interactively, see how to [use the v1 API with HTTP clients and custom code](#use-the-v1-api-with-http-clients-and-custom-code).
