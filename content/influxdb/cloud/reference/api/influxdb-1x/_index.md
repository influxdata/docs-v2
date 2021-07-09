---
title: InfluxDB 1.x compatibility API
description: >
  The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
  InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.
menu:
  influxdb_cloud_ref:
    name: 1.x compatibility
    parent: InfluxDB v2 API
weight: 104
influxdb/cloud/tags: [influxql, query, write]
products: [cloud]
related:
  - /influxdb/cloud/query-data/influxql
---

The InfluxDB v2 API includes InfluxDB 1.x compatibility `/write` and `/query`
endpoints that work with InfluxDB 1.x client libraries and third-party integrations
like [Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/cloud/api/v1-compatibility/">View full v1 compatibility API documentation</a>

## Authentication

{{% cloud %}}
InfluxDB Cloud requires all query and write requests to be authenticated using
[InfluxDB authentication tokens](/influxdb/cloud/security/tokens/).
{{% /cloud %}}

Use the following authentication methods to with InfluxDB 1.x compatibility endpoints:

* [token authentication](#authenticate-with-a-token)
* [username and password authentication](#authenticate-with-a-username-and-password)

### Authenticate with a token
Token authentication requires the following credential:

- **token**: InfluxDB [authentication token](/influxdb/cloud/security/tokens/)

Use the `Authorization` header with the `Token` scheme to provide your
authentication token to InfluxDB.

##### Syntax
```sh
Authorization: Token <token>
```

##### Example

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-assets-text "api/v1-compat/auth/oss/token-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-assets-text "api/v1-compat/auth/oss/token-auth.js" %}}
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

### Authenticate with a username and password
Use the following authentication schemes with clients that support the InfluxDB 1.x convention of username and password (that don't support the `Authorization: Token` scheme):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

- **username**: InfluxDB Cloud username
- **password**: InfluxDB Cloud [authentication token](/influxdb/cloud/security/tokens/)

#### Basic authentication
Use the `Authentication Basic` scheme.

#### Syntax
{{% api/v1-compat/basic-auth-syntax %}}

#### Example

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-assets-text "api/v1-compat/auth/oss/basic-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-assets-text "api/v1-compat/auth/cloud/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

#### Query string authentication
Use InfluxDB 1.x API parameters to provide credentials through the query string.

{{% api/url-encode-note %}}

{{% warn %}}
##### Information exposure through query strings
Be aware of [the risks](https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url) when exposing sensitive data through URLs.
{{% /warn %}}

##### Syntax

```sh
 /query/?u=<username>&p=<password>
 /write/?u=<username>&p=<password>
 ```

##### Example

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-assets-text "api/v1-compat/auth/oss/querystring-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-assets-text "api/v1-compat/auth/oss/querystring-auth.js" %}}
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

## InfluxQL support

The compatibility API supports InfluxQL, with the following caveats:

- The `INTO` clause (e.g. `SELECT ... INTO ...`) is not supported.
- With the exception of [`DELETE`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-series-with-delete) and
  [`DROP MEASUREMENT`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-measurements-with-drop-measurement) queries, which are still allowed,
  InfluxQL database management commands are not supported.

## Compatibility endpoints

{{< children readmore=true >}}
