
Use the InfluxDB v1 HTTP query API to query data in {{< product-name >}}
with InfluxQL.

The examples below use **cURL** to send HTTP requests to the InfluxDB v1 HTTP API,
but you can use any HTTP client.

> [!Warning]
> #### InfluxQL feature support
> 
> InfluxQL is being rearchitected to work with the InfluxDB 3 storage engine.
> This process is ongoing and some InfluxQL features are still being implemented.
> For information about the current implementation status of InfluxQL features,
> see [InfluxQL feature support](/influxdb3/version/reference/influxql/feature-support/).

Use the v1 `/query` endpoint and the `GET` request method to query data with InfluxQL:

{{< api-endpoint endpoint="http://{{< influxdb/host >}}/query" method="get" api-ref="/influxdb3/version/api/#tag/Query" >}}

## Authenticate API requests

{{< product-name >}} requires each API request to be authenticated with a
{{% token-link %}}.
With InfluxDB v1-compatible endpoints in InfluxDB 3, you can use database tokens in InfluxDB 1.x username and password
schemes, in the InfluxDB v2 `Authorization: Token` scheme, or in the OAuth `Authorization: Bearer` scheme.

- [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
- [Authenticate with a token scheme](#authenticate-with-a-token-scheme)

### Authenticate with a username and password scheme

With InfluxDB v1-compatible endpoints in InfluxDB 3, you can use the InfluxDB 1.x convention of
username and password to authenticate database reads by passing a {{% token-link %}}{{% show-in "enterprise" %}} with read access to the database{{% /show-in %}} as the `password` credential.
When authenticating requests to the v1 API `/query` endpoint, {{< product-name >}} checks that the `password` (`p`) value is an authorized {{% token-link %}}{{% show-in "enterprise" %}} with read access to the database{{% /show-in %}}.
{{< product-name >}} ignores the `username` (`u`) parameter in the request.

Use one of the following authentication schemes with clients that support Basic authentication or query parameters:

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to authenticate v1 API `/query` requests.
When authenticating requests, {{< product-name >}} checks that the `password` part of the decoded credential is an authorized {{% token-link %}}{{% show-in "enterprise" %}} with read access to the database{{% /show-in %}}.
{{< product-name >}} ignores the `username` part of the decoded credential.

##### Syntax

```http
Authorization: Basic <base64-encoded [USERNAME]:DATABASE_TOKEN>
```

Encode the `[USERNAME]:DATABASE_TOKEN` credential using base64 encoding, and then append the encoded string to the `Authorization: Basic` header.

##### Example

The following example shows how to use cURL with the `Basic` authentication scheme:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl --get "https://{{< influxdb/host >}}/query" \
  --user "":"DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

#### Query string authentication

In the URL, pass the `p` query parameter to authenticate `/query` requests.
When authenticating requests, {{< product-name >}} checks that the `p` (_password_) value is an authorized {{% token-link %}}{{% show-in "enterprise" %}} with read access to the database{{% /show-in %}} and ignores the `u` (_username_) parameter.

##### Syntax

```sh
https://{{< influxdb/host >}}/query/?u=any&p=DATABASE_TOKEN
```

##### Example

The following example shows how to use cURL with query string authentication:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl --get "https://{{< influxdb/host >}}/query" \
  --data-urlencode "p=DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

### Authenticate with a token scheme

Use the `Authorization: Bearer` or the `Authorization: Token` scheme to pass a {{% token-link %}}{{% show-in "enterprise" %}} with read access to the database{{% /show-in %}} for authenticating
v1 API `/query` requests.

`Bearer` and `Token` are equivalent in {{< product-name >}}.
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

Use `Bearer` to authenticate a query request:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl --get "https://{{< influxdb/host >}}/query" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

Use `Token` to authenticate a query request:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl --get "https://{{< influxdb/host >}}/query" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

## Query parameters

For {{< product-name >}} v1 API `/query` requests, set parameters as listed in the following table:

Parameter | Allowed in | Ignored | Value
----------|------------|---------|-------------------------------------------------------------------------
`chunked` | Query string | Honored | Returns points in streamed batches instead of in a single response. If set to `true`, InfluxDB chunks responses by series or by every 10,000 points, whichever occurs first.
`chunked_size` | Query string | Honored | **Requires `chunked` to be set to `true`**. If set to a specific value, InfluxDB chunks responses by series or by this number of points.
`db` {{% req " \*" %}} | Query string | Honored | Database name
`epoch` | Query string | Honored | [Timestamp precision](#timestamp-precision)
`p` | Query string | Honored | For [query string authentication](#query-string-authentication), a {{% token-link %}}{{% show-in "enterprise" %}} with read access to the database{{% /show-in %}}
`pretty` | Query string | Ignored | N/A
`q` {{% req " \*" %}} | Query string | Honored | URL-encoded InfluxQL query
`rp` | Query string | Honored, but discouraged | Retention policy
`u` | Query string | Ignored | For [query string authentication](#query-string-authentication), any arbitrary string
`Authorization` | Header | Honored | `Bearer DATABASE_TOKEN`, `Token DATABASE_TOKEN`, or `Basic <base64 [USERNAME]:DATABASE_TOKEN>`

{{% caption %}}{{% req " \*" %}} = {{% req "Required" %}}{{% /caption %}}

### Timestamp precision

Use one of the following values for timestamp precision:

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

Replace the following configuration values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the [database](/influxdb3/version/admin/databases/) to query
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}{{% show-in "enterprise" %}} with read access to the database{{% /show-in %}}

## Return results as JSON or CSV

By default, the `/query` endpoint returns results in **JSON**, but it can also
return results in **CSV**. To return results as CSV, include the `Accept` header
with the `application/csv` or `text/csv` MIME type:

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```sh
curl --get https://{{< influxdb/host >}}/query \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}
