---
title: InfluxDB 1.x compatibility API
description: >
  The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
  InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.
menu:
  influxdb_2_1_ref:
    name: 1.x compatibility
    parent: InfluxDB v2 API
weight: 104
influxdb/v2.1/tags: [influxql, query, write]
related:
  - /influxdb/v2.1/query-data/influxql
  - /influxdb/v2.1/upgrade/v1-to-v2/
---

The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/v2.1/api/v1-compatibility/">View full v1 compatibility API documentation</a>

## Authentication
InfluxDB {{< current-version >}} requires all query and write requests to be authenticated with an
[API token](/influxdb/v2.1/security/tokens/) or 1.x compatible
credentials.

* [Authenticate with the Token scheme](#authenticate-with-the-token-scheme)
* [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)

### Authenticate with the Token scheme
Token authentication requires the following credential:

- **token**: InfluxDB [API token](/influxdb/v2.1/security/tokens/)

Use the `Authorization` header with the `Token` scheme to provide your token to InfluxDB.

#### Syntax

```sh
Authorization: Token <token>
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

Use the following authentication schemes with clients that support the InfluxDB 1.x convention of `username` and `password` (that don't support the `Authorization: Token` scheme):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

##### Manage credentials

Username and password schemes require the following credentials:
- **username**: 1.x username (this is separate from the UI login username)
- **password**: 1.x password or InfluxDB API token.

{{% note %}}
#### Password or Token
{{% api/v1-compat/oss/password-or-token %}}
{{% /note %}}

For information about creating and managing 1.x-compatible authorizations, see:

- [`influx v1 auth` command](/influxdb/v2.1/reference/cli/influx/v1/auth/)
- [Manually upgrade – 1.x-compatible authorizations](/influxdb/v2.1/upgrade/v1-to-v2/manual-upgrade/#1x-compatible-authorizations)

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to provide username and
password credentials to InfluxDB.

{{% api/v1-compat/basic-auth-syntax %}}

##### Syntax
```sh
Authorization: Basic <username>:<password>
```

##### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-shared-text "api/v1-compat/auth/oss/basic-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/oss/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Query string authentication
Use InfluxDB 1.x API parameters to provide credentials through the query string.

{{% note %}}
##### Consider when using query string parameters

- URL-encode query parameters that may contain whitespace or other special characters.
- Be aware of the [risks](https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url) when exposing sensitive data through URLs.
{{% /note %}}

##### Syntax

```sh
 /query/?u=<username>&p=<password>
 /write/?u=<username>&p=<password>
 ```

##### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{< get-shared-text "api/v1-compat/auth/oss/querystring-auth.sh" >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{< get-shared-text "api/v1-compat/auth/oss/querystring-auth.js" >}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

##### InfluxQL support

The compatibility API supports InfluxQL, with the following caveats:

- The `INTO` clause (e.g. `SELECT ... INTO ...`) is not supported.
- With the exception of [`DELETE`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-series-with-delete) and
  [`DROP MEASUREMENT`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-measurements-with-drop-measurement) queries, which are still allowed,
  InfluxQL database management commands are not supported.

## Compatibility endpoints

{{< children readmore=true >}}
