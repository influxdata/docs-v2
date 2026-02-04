
Use compatibility APIs when you need to migrate existing InfluxDB v1 or v2 write
workloads to InfluxDB 3.x.
The `/api/v2/write` (v2-compatible) and `/write` (v1-compatible) HTTP API
endpoints work with InfluxDB [client libraries](/influxdb3/version/reference/client-libraries/), [Telegraf](/telegraf/v1/), and third-party integrations 
to write points as line protocol data to {{% product-name %}}.

> [!Tip]
> #### Choose the write endpoint for your workload
> 
> When creating new write workloads, use the
> [InfluxDB HTTP API `/api/v3/write_lp` endpoint](/influxdb3/version/write-data/http-api/v3-write-lp/)
> and [client libraries](/influxdb3/version/write-data/client-libraries/).
>
> When bringing existing v1 write workloads, use the {{% product-name %}}
> HTTP API [`/write` endpoint](/influxdb3/core/api/v3/#post-/write).
>
> When bringing existing v2 write workloads, use the {{% product-name %}}
> HTTP API [`/api/v2/write` endpoint](/influxdb3/version/api/v3/#operation/PostV2Write).
>
> **For Telegraf**, use the InfluxDB v1.x [`outputs.influxdb`](/telegraf/v1/output-plugins/influxdb/) or v2.x [`outputs.influxdb_v2`](/telegraf/v1/output-plugins/influxdb_v2/) output plugins.
> See how to [use Telegraf to write data](/influxdb3/version/write-data/use-telegraf/).

> [!Note]
> #### Compatibility APIs differ from native APIs
> 
> Keep in mind that the compatibility APIs differ from the v1 and v2 APIs in previous versions in the following ways:
>
> - Tags in a table (measurement) are _immutable_
> - A tag and a field can't have the same name within a table.

## InfluxDB v2 compatibility

The `/api/v2/write` InfluxDB v2 compatibility endpoint provides backwards
compatibility with clients that can write data to InfluxDB OSS v2.x and Cloud 2 (TSM).

{{<api-endpoint endpoint="/api/v2/write?bucket=mydb&precision=ns" method="post" api-ref="/influxdb3/version/api/v3/#operation/PostV1Write" >}}

### Authenticate v2 API requests

{{< product-name >}} requires each API request to be authenticated with a {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}}.

Use the `Authorization: Bearer` or `Authorization: Token` scheme to authenticate v2 API write requests:

#### Syntax

```http
Authorization: Bearer DATABASE_TOKEN
```

```http
Authorization: Token DATABASE_TOKEN
```

#### Examples

Use `Bearer` to authenticate a v2 write request:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl -i "https://{{< influxdb/host >}}/api/v2/write?bucket=DATABASE_NAME&precision=s" \
    --header "Authorization: Bearer DATABASE_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1641024000'
```
{{% /code-placeholders %}}

Use `Token` to authenticate a v2 write request:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl -i "https://{{< influxdb/host >}}/api/v2/write?bucket=DATABASE_NAME&precision=s" \
    --header "Authorization: Token DATABASE_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1641024000'
```
{{% /code-placeholders %}}

### v2 API write parameters

For {{< product-name >}} v2 API `/api/v2/write` requests, set parameters as listed in the following table:

Parameter | Allowed in | Ignored | Value
----------|------------|---------|-------------------------------------------------------------------------
`bucket` {{% req " \*" %}} | Query string | Honored | Database name
`precision` | Query string | Honored | [Timestamp precision](#timestamp-precision-v2)
`Content-Encoding` | Header | Honored | `gzip` (compressed data) or `identity` (uncompressed)
`Authorization` | Header | Honored | `Bearer DATABASE_TOKEN` or `Token DATABASE_TOKEN`

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision {#timestamp-precision-v2}

> [!Note]
> By default, {{% product-name %}} uses the timestamp magnitude to auto-detect the precision.
> To avoid any ambiguity, you can specify the precision of timestamps in your data.

Use one of the following `precision` values in v2 API `/api/v2/write` requests:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

## InfluxDB v1 compatibility

The `/write` InfluxDB v1 compatibility endpoint provides backwards compatibility with clients that can write data to InfluxDB v1.x.

{{<api-endpoint endpoint="/write?db=mydb&precision=ns" method="post" api-ref="/influxdb3/version/api/v3/#operation/PostV2Write" >}}

### Authenticate v1 API requests

{{< product-name >}} requires each API request to be authenticated with a {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}}.
With InfluxDB v1-compatible endpoints in InfluxDB 3, you can use database tokens in InfluxDB 1.x username and password
schemes, in the InfluxDB v2 `Authorization: Token` scheme, or in the OAuth `Authorization: Bearer` scheme.

- [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
- [Authenticate with a token scheme](#authenticate-with-a-token-scheme)

#### Authenticate with a username and password scheme

With InfluxDB v1-compatible endpoints, you can use the InfluxDB 1.x convention of
username and password to authenticate database writes by passing a {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}} as the `password` credential.
When authenticating requests to the v1 API `/write` endpoint, {{< product-name >}} checks that the `password` (`p`) value is an authorized {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}}.
{{< product-name >}} ignores the `username` (`u`) parameter in the request.

Use one of the following authentication schemes with clients that support Basic authentication or query parameters:

- [Basic authentication](#basic-authentication-v1)
- [Query string authentication](#query-string-authentication-v1)

##### Basic authentication {#basic-authentication-v1}

Use the `Authorization` header with the `Basic` scheme to authenticate v1 API `/write` requests.
When authenticating requests, {{< product-name >}} checks that the `password` part of the decoded credential is an authorized {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}}.
{{< product-name >}} ignores the `username` part of the decoded credential.

###### Syntax

```http
Authorization: Basic <base64-encoded [USERNAME]:DATABASE_TOKEN>
```

Encode the `[USERNAME]:DATABASE_TOKEN` credential using base64 encoding, and then append the encoded string to the `Authorization: Basic` header.

###### Example

The following example shows how to use cURL with the `Basic` authentication scheme:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl -i "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&precision=s" \
  --user "any:DATABASE_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --data-binary 'home,room=kitchen temp=72 1641024000'
```
{{% /code-placeholders %}}

##### Query string authentication {#query-string-authentication-v1}

In the URL, pass the `p` query parameter to authenticate `/write` requests.
When authenticating requests, {{< product-name >}} checks that the `p` (_password_) value is an authorized {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}} and ignores the `u` (_username_) parameter.

###### Syntax

```sh
https://{{< influxdb/host >}}/write/?u=any&p=DATABASE_TOKEN
```

###### Example

The following example shows how to use cURL with query string authentication:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl -i "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&precision=s&p=DATABASE_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --data-binary 'home,room=kitchen temp=72 1641024000'
```
{{% /code-placeholders %}}

#### Authenticate with a token scheme

Use the `Authorization: Bearer` or the `Authorization: Token` scheme to pass a {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}} for authenticating
v1 API `/write` requests.

`Bearer` and `Token` are equivalent in {{< product-name >}}.
The `Token` scheme is used in the InfluxDB 2.x API.
`Bearer` is defined by the [OAuth 2.0 Framework](https://www.rfc-editor.org/rfc/rfc6750#page-14).
Support for one or the other may vary across InfluxDB API clients.

##### Syntax

```http
Authorization: Bearer DATABASE_TOKEN
```

```http
Authorization: Token DATABASE_TOKEN
```

##### Examples

Use `Bearer` to authenticate a v1 write request:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl -i "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&precision=s" \
    --header "Authorization: Bearer DATABASE_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1641024000'
```
{{% /code-placeholders %}}

Use `Token` to authenticate a v1 write request:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl -i "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&precision=s" \
    --header "Authorization: Token DATABASE_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1641024000'
```
{{% /code-placeholders %}}

### v1 API write parameters

For {{< product-name >}} v1 API `/write` requests, set parameters as listed in the following table:

Parameter | Allowed in | Ignored | Value
----------|------------|---------|-------------------------------------------------------------------------
`consistency` | Query string | Ignored | N/A
`db` {{% req " \*" %}} | Query string | Honored | Database name
`precision` | Query string | Honored | [Timestamp precision](#timestamp-precision-v1)
`rp` | Query string | Honored, but discouraged | Retention policy
`u` | Query string | Ignored | For [query string authentication](#query-string-authentication-v1), any arbitrary string
`p` | Query string | Honored | For [query string authentication](#query-string-authentication-v1), a {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}}
`Content-Encoding` | Header | Honored | `gzip` (compressed data) or `identity` (uncompressed)
`Authorization` | Header | Honored | `Bearer DATABASE_TOKEN`, `Token DATABASE_TOKEN`, or `Basic <base64 [USERNAME]:DATABASE_TOKEN>`

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

#### Timestamp precision {#timestamp-precision-v1}

> [!Note]
> By default, {{% product-name %}} uses the timestamp magnitude to auto-detect the precision.
> To avoid any ambiguity, you can specify the precision of timestamps in your data.

Use one of the following `precision` values in v1 API `/write` requests:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

## Client library examples

Use language-specific client libraries with your custom code to write data to {{< product-name >}}.

### v1 client libraries

v1 client libraries send data in [line protocol](/influxdb3/version/reference/syntax/line-protocol/) syntax to the v1 API `/write` endpoint.

{{< tabs-wrapper >}}
{{% tabs %}}
[Node.js](#)
[Python](#)
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
  protocol: 'https',
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
  password='DATABASE_TOKEN',
  headers={'Content-Type': 'text/plain; charset=utf-8'}
)
```
{{% /code-placeholders %}}

<!-- End Python -->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### v2 client libraries

v2 client libraries send data in [line protocol](/influxdb3/version/reference/syntax/line-protocol/) syntax to the v2 API `/api/v2/write` endpoint.

For more information about using v2 client libraries, see [v2 client libraries](/influxdb3/version/reference/client-libraries/v2/).

## Telegraf configuration

If you have existing v1 workloads that use Telegraf,
you can use the [InfluxDB v1.x `influxdb` Telegraf output plugin](/telegraf/v1/output-plugins/influxdb/) to write data.

The following table shows `outputs.influxdb` plugin parameters and values for writing to the {{< product-name >}} v1 API:

Parameter | Ignored | Value
----------|---------|-------------------------------------------------------------------------------------------
`database` | Honored | Database name
`retention_policy` | Honored, but discouraged | [Duration](/influxdb3/version/reference/glossary/#duration)
`username` | Ignored | String or empty
`password` | Honored | {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}}
`content_encoding` | Honored | `gzip` (compressed data) or `identity` (uncompressed)
`skip_database_creation` | Ignored | N/A (see how to [create a database](/influxdb3/version/admin/databases/create/))

To configure the v1.x output plugin for writing to {{< product-name >}}, add the following `outputs.influxdb` configuration in your `telegraf.conf` file:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```toml
[[outputs.influxdb]]
  urls = ["https://{{< influxdb/host >}}"]
  database = "DATABASE_NAME"
  skip_database_creation = true
  retention_policy = ""
  username = "ignored"
  password = "DATABASE_TOKEN"
  content_encoding = "gzip"
```
{{% /code-placeholders %}}

Replace the following configuration values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the [database](/influxdb3/version/admin/databases/) to write to
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}{{% show-in "enterprise" %}} with write access to the database{{% /show-in %}}

