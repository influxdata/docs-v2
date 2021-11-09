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
[InfluxDB API tokens](/influxdb/cloud/security/tokens/).
{{% /cloud %}}

Use InfluxDB API tokens with the following authentication schemes:

* [Authenticate with the Token scheme](#authenticate-with-the-token-scheme)
* [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)

### Authenticate with the Token scheme
Token authentication requires the following credential:

- **token**: InfluxDB [API token](/influxdb/cloud/security/tokens/)

Use the `Authorization` header with the `Token` scheme to provide your
token to InfluxDB.

##### Syntax
```sh
Authorization: Token INFLUXDB_API_TOKEN 
```

##### Example

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

Use the following schemes with clients that support the InfluxDB 1.x convention of username and password (that don't support the `Authorization: Token` scheme):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

##### Manage credentials

Username and password schemes require the following credentials:
- **username**: InfluxDB Cloud username
  (Use the email address you signed up with as your username, _e.g._ `exampleuser@influxdata.com`.)
- **password**: InfluxDB Cloud [API token](/influxdb/cloud/security/tokens/)

#### Basic authentication
Use the `Authorization` header with the `Basic` scheme to provide username and password credentials to InfluxDB.

{{% api/v1-compat/basic-auth-syntax %}}

##### Syntax
```sh
Authorization: Basic INFLUX_USERNAME:INFLUX_API_TOKEN
```

##### Example

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

#### Query string authentication
Use InfluxDB 1.x API parameters to provide username and password credentials through the query string.

{{% note %}}
##### Consider when using query string parameters

- URL-encode query parameters that may contain whitespace or other special characters.
- Be aware of the [risks](https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url) when exposing sensitive data through URLs.
{{% /note %}}

##### Syntax

```sh
 /query/?u=INFLUX_USERNAME&p=INFLUX_API_TOKEN
 /write/?u=INFLUX_USERNAME&p=INFLUX_API_TOKEN
 ```

##### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{% get-shared-text "api/v1-compat/auth/cloud/querystring-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/cloud/querystring-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following:
- *`exampleuser@influxdata.com`*: the email address that you signed up with
- *`INFLUX_API_TOKEN`*: your [InfluxDB API token](/influxdb/cloud/reference/glossary/#token) 

## InfluxQL support

The compatibility API supports InfluxQL, with the following caveats:

- The `INTO` clause (e.g. `SELECT ... INTO ...`) is not supported.
- With the exception of [`DELETE`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-series-with-delete) and
  [`DROP MEASUREMENT`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-measurements-with-drop-measurement) queries, which are still allowed,
  InfluxQL database management commands are not supported.

## Compatibility endpoints

{{< children readmore=true >}}
