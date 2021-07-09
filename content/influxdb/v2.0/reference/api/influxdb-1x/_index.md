---
title: InfluxDB 1.x compatibility API
description: >
  The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
  InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.
menu:
  influxdb_2_0_ref:
    name: 1.x compatibility
    parent: InfluxDB v2 API
weight: 104
influxdb/v2.0/tags: [influxql, query, write]
related:
  - /influxdb/v2.0/query-data/influxql
  - /influxdb/v2.0/upgrade/v1-to-v2/
---

The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/v2.0/api/v1-compatibility/">View full v1 compatibility API documentation</a>

## Authentication
InfluxDB 2.0 requires all query and write requests to be authenticated.

* [Authenticate with a token](#authenticate-with-a-token)
* [Authenticate with a username and password](#authenticate-with-a-username-and-password)

### Authenticate with a Token
Token authentication requires the following credential:

- **token**: InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)

Use the `Authorization` header with the `Token` scheme to provide your
authentication token to InfluxDB.

#### Syntax

```sh
Authorization: Token <token>
```

#### Example

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
Username and password authentication requires the following credentials:
- **username**: 1.x username (this is separate from the UI login username)
- **password**: 1.x password or InfluxDB authorization token.

{{% note %}}
#### Password or Token?
{{% api/v1-compat/password-or-token %}}
{{% /note %}}

Use the following authentication schemes with clients that support the InfluxDB 1.x convention of `username` and `password` (that don't support the `Authorization: Token` scheme):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

{{% note %}}
#### Password or Token
{{% api/v1-compat/password-or-token %}}
{{% /note %}}

For information about creating and managing 1.x-compatible authorizations, see:

- [influx v1 auth](/influxdb/v2.0/reference/cli/influx/v1/auth/)
- [Manually upgrade – 1.x-compatible authorizations](/influxdb/v2.0/upgrade/v1-to-v2/manual-upgrade/#1x-compatible-authorizations)

#### Basic authentication

##### Syntax

{{% api/v1-compat/basic-auth-syntax %}}

##### Example

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
{{% get-assets-text "api/v1-compat/auth/oss/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

#### Query string authentication
Use InfluxDB 1.x API parameters to provide credentials through the query string.

{{% note %}}
##### Using query string parameters

* URL-encode query parameters that may contain whitespace or other special characters.

* Be aware of the <a href="https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url">risks</a> when exposing sensitive data through URLs.
{{% /note %}}

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
{{< get-assets-text "api/v1-compat/auth/oss/querystring-auth.sh" >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{< get-assets-text "api/v1-compat/auth/oss/querystring-auth.js" >}}
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

##### InfluxQL support

The compatibility API supports InfluxQL, with the following caveats:

- The `INTO` clause (e.g. `SELECT ... INTO ...`) is not supported.
- With the exception of [`DELETE`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-series-with-delete) and
  [`DROP MEASUREMENT`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-measurements-with-drop-measurement) queries, which are still allowed,
  InfluxQL database management commands are not supported.

## Compatibility endpoints

{{< children readmore=true >}}
