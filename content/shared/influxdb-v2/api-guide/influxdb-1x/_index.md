
The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/version/api/v1-compatibility/">View full v1 compatibility API documentation</a>

## Authentication

InfluxDB 1.x compatibility endpoints require all query and write requests to be authenticated with an
[API token](/influxdb/version/admin/tokens/) or 1.x-compatible
credentials.

* [Authenticate with the Token scheme](#authenticate-with-the-token-scheme)
* [Authenticate with a 1.x username and password scheme](#authenticate-with-a-username-and-password-scheme)

### Authenticate with the Token scheme
Token authentication requires the following credential:

- **token**: InfluxDB [API token](/influxdb/version/admin/tokens/)

Use the `Authorization` header with the `Token` scheme to provide your token to InfluxDB.
The `Token` scheme is the word `Token`, a space, and your token (all case-sensitive).

#### Syntax

```http
Authorization: Token INFLUX_API_TOKEN
```

#### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

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

{{% show-in "v2" %}}

Username and password schemes require the following credentials:
- **username**: 1.x username (this is separate from the UI login username)
- **password**: 1.x password or InfluxDB API token.

{{% note %}}
#### Password or Token

If you have [set a password](/influxdb/version/install/upgrade/v1-to-v2/manual-upgrade/#1x-compatible-authorizations) for the 1.x-compatible username, provide the 1.x-compatible password.
If you haven't set a password for the 1.x-compatible username, provide the InfluxDB [authentication token](/influxdb/version/admin/tokens/) as the password.
{{% /note %}}

For more information, see how to create and manage
[1.x-compatible authorizations](/influxdb/version/install/upgrade/v1-to-v2/manual-upgrade/#1x-compatible-authorizations)
when manually upgrading from InfluxDB v1 to v2.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

- **username**: InfluxDB Cloud username
  (Use the email address you signed up with as your username--for example, `exampleuser@influxdata.com`.)
- **password**: InfluxDB Cloud [API token](/influxdb/cloud/admin/tokens/)

{{% /show-in %}}

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to provide username and
password credentials to InfluxDB.

{{% api/v1-compat/basic-auth-syntax %}}

##### Syntax

{{% show-in "v2" %}}

```http
Authorization: Basic INFLUX_USERNAME:INFLUX_PASSWORD_OR_TOKEN
```

{{% /show-in %}}


{{% show-in "cloud,cloud-serverless" %}}

```http
Authorization: Basic exampleuser@influxdata.com:INFLUX_API_TOKEN
```

{{% /show-in %}}

##### Example

{{% code-placeholders "INFLUX_(USERNAME|PASSWORD_OR_TOKEN|API_TOKEN)|exampleuser@influxdata.com" %}}

{{% show-in "v2" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

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

{{% /show-in %}}


{{% show-in "cloud,cloud-serverless" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

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
- {{% code-placeholder-key %}}`exampleuser@influxdata.com`{{% /code-placeholder-key %}}: the email address that you signed up with
- {{% code-placeholder-key %}}`INFLUX_API_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB API token](/influxdb/cloud/reference/glossary/#token)

{{% /show-in %}}

#### Query string authentication
Use InfluxDB 1.x API parameters to provide credentials through the query string.

{{% note %}}
##### Consider when using query string parameters

- URL-encode query parameters that may contain whitespace or other special characters.
- Be aware of the [risks](https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url) when exposing sensitive data through URLs.
{{% /note %}}

##### Syntax

{{% show-in "v2" %}}

```http
 /query/?u=INFLUX_USERNAME&p=INFLUX_PASSWORD_OR_TOKEN
 /write/?u=INFLUX_USERNAME&p=INFLUX_PASSWORD_OR_TOKEN
 ```

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

```http
/query/?u=INFLUX_USERNAME&p=INFLUX_API_TOKEN
/write/?u=INFLUX_USERNAME&p=INFLUX_API_TOKEN
```

{{% /show-in %}}

##### Example

{{% show-in "v2" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

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
- {{% code-placeholder-key %}}`INFLUX_USERNAME`{{% /code-placeholder-key %}}: [InfluxDB 1.x username](#manage-credentials)
- {{% code-placeholder-key %}}`INFLUX_PASSWORD_OR_TOKEN`{{% /code-placeholder-key %}}: [InfluxDB 1.x password or InfluxDB API token](#manage-credentials)

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

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

{{% /code-placeholders %}}

Replace the following:
- {{% code-placeholder-key %}}`exampleuser@influxdata.com`{{% /code-placeholder-key %}}: the email address that you signed up with
- {{% code-placeholder-key %}}`INFLUX_API_TOKEN`{{% /code-placeholder-key %}}: your [InfluxDB API token](/influxdb/cloud/reference/glossary/#token)

{{% /show-in %}}

##### InfluxQL support

The compatibility API supports InfluxQL, with the following caveats:

- The `INTO` clause (for example, `SELECT ... INTO ...`) is not supported.
- With the exception of [`DELETE`](/influxdb/v1/query_language/manage-database/#delete-series-with-delete) and
  [`DROP MEASUREMENT`](/influxdb/v1/query_language/manage-database/#delete-measurements-with-drop-measurement) queries, which are still allowed,
  InfluxQL database management commands are not supported.

## Compatibility endpoints

{{< children readmore=true >}}
