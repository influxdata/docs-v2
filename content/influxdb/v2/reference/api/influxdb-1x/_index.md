---
title: InfluxDB 1.x compatibility API
description: >
  The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
  InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.
menu:
  influxdb_v2:
    name: v1 compatibility
    parent: InfluxDB v2 API
weight: 104
influxdb/v2/tags: [influxql, query, write]
related:
  - /influxdb/v2/query-data/influxql
  - /influxdb/v2/install/upgrade/v1-to-v2/
---

The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/v2/api/v1-compatibility/">View full v1 compatibility API documentation</a>

## Authentication

InfluxDB 1.x compatibility endpoints require all query and write requests to be authenticated with an
[API token](/influxdb/v2/admin/tokens/) or 1.x-compatible
credentials.

* [Authenticate with the Token scheme](#authenticate-with-the-token-scheme)
* [Authenticate with a 1.x username and password scheme](#authenticate-with-a-username-and-password-scheme)

### Authenticate with the Token scheme
Token authentication requires the following credential:

- **token**: InfluxDB [API token](/influxdb/v2/admin/tokens/)

Use the `Authorization` header with the `Token` scheme to provide your token to InfluxDB.

#### Syntax

```sh
Authorization: Token INFLUX_API_TOKEN
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

#### Manage credentials

{{% oss-only %}}

Username and password schemes require the following credentials:
- **username**: 1.x username (this is separate from the UI login username)
- **password**: 1.x password or InfluxDB API token.

{{% note %}}
#### Password or Token
If you have [set a password](/influxdb/v2/upgrade/v1-to-v2/manual-upgrade/#1x-compatible-authorizations) for the 1.x-compatible username, provide the 1.x-compatible password.
If you haven't set a password for the 1.x-compatible username, provide the InfluxDB [authentication token](/influxdb/v2/admin/tokens/) as the password.
{{% /note %}}

For information about creating and managing 1.x-compatible authorizations, see:

- [`influx v1 auth` command](/influxdb/v2/reference/cli/influx/v1/auth/)
- [Manually upgrade – 1.x-compatible authorizations](/influxdb/v2/upgrade/v1-to-v2/manual-upgrade/#1x-compatible-authorizations)

{{% /oss-only %}}

{{% cloud-only %}}

- **username**: InfluxDB Cloud username
  (Use the email address you signed up with as your username, _e.g._ `exampleuser@influxdata.com`.)
- **password**: InfluxDB Cloud [API token](/influxdb/cloud/admin/tokens/)

{{% /cloud-only %}}

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to provide username and
password credentials to InfluxDB.

{{% api/v1-compat/basic-auth-syntax %}}

##### Syntax

{{% oss-only %}}

```sh
Authorization: Basic INFLUX_USERNAME:INFLUX_PASSWORD_OR_TOKEN
```

{{% /oss-only %}}


{{% cloud-only %}}

```sh
Authorization: Basic exampleuser@influxdata.com:INFLUX_API_TOKEN
```

{{% /cloud-only %}}

##### Example

{{% oss-only %}}

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

{{% /oss-only %}}


{{% cloud-only %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-shared-text "api/v1-compat/auth/cloud/basic-auth.sh" %}}
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/cloud/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:
- *`exampleuser@influxdata.com`*: the email address that you signed up with
- *`INFLUX_API_TOKEN`*: your [InfluxDB API token](/influxdb/cloud/reference/glossary/#token)

{{% /cloud-only %}}

#### Query string authentication
Use InfluxDB 1.x API parameters to provide credentials through the query string.

{{% note %}}
##### Consider when using query string parameters

- URL-encode query parameters that may contain whitespace or other special characters.
- Be aware of the [risks](https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url) when exposing sensitive data through URLs.
{{% /note %}}

##### Syntax

{{% oss-only %}}

```sh
 /query/?u=INFLUX_USERNAME&p=INFLUX_PASSWORD_OR_TOKEN
 /write/?u=INFLUX_USERNAME&p=INFLUX_PASSWORD_OR_TOKEN
 ```

{{% /oss-only %}}

{{% cloud-only %}}

```sh
/query/?u=INFLUX_USERNAME&p=INFLUX_API_TOKEN
/write/?u=INFLUX_USERNAME&p=INFLUX_API_TOKEN
```

{{% /cloud-only %}}

##### Example

{{% oss-only %}}
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

Replace the following:
- *`INFLUX_USERNAME`*: [InfluxDB 1.x username](#manage-credentials)
- *`INFLUX_PASSWORD_OR_TOKEN`*: [InfluxDB 1.x password or InfluxDB API token](#manage-credentials)

{{% /oss-only %}}

{{% cloud-only %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-shared-text "api/v1-compat/auth/cloud/basic-auth.sh" %}}
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/cloud/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:
- *`exampleuser@influxdata.com`*: the email address that you signed up with
- *`INFLUX_API_TOKEN`*: your [InfluxDB API token](/influxdb/cloud/reference/glossary/#token)

{{% /cloud-only %}}

##### InfluxQL support

The compatibility API supports InfluxQL, with the following caveats:

- The `INTO` clause (e.g. `SELECT ... INTO ...`) is not supported.
- With the exception of [`DELETE`](/influxdb/v1/query_language/manage-database/#delete-series-with-delete) and
  [`DROP MEASUREMENT`](/influxdb/v1/query_language/manage-database/#delete-measurements-with-drop-measurement) queries, which are still allowed,
  InfluxQL database management commands are not supported.

## Compatibility endpoints

{{< children readmore=true >}}
