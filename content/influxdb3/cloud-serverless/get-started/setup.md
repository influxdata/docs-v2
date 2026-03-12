---
title: Set up InfluxDB
seotitle: Set up InfluxDB | Get started with InfluxDB
list_title: Set up InfluxDB
description: >
  Learn how to set up InfluxDB for the "Get started with InfluxDB" tutorial
  and for general use.
menu:
  influxdb3_cloud_serverless:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 3]
related:
  - /influxdb3/cloud-serverless/security/tokens/
  - /influxdb3/cloud-serverless/security/tokens/create-token/
  - /influxdb3/cloud-serverless/security/tokens/view-tokens/
  - /influxdb3/cloud-serverless/admin/buckets/
  - /influxdb3/cloud-serverless/reference/mcp-server/
  - /influxdb3/cloud-serverless/reference/cli/influx/
  - /influxdb3/cloud-serverless/reference/api/
aliases:
  - /influxdb3/cloud-serverless/security/tokens/
  - /influxdb3/cloud-serverless/security/tokens/create-token/
  - /influxdb3/cloud-serverless/security/tokens/view-tokens/
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

- [_Optional:_ Download, install, and configure the influx CLI](#download-install-and-configure-the-influx-cli)
- [Create an All Access API token](#create-an-all-access-api-token)
- [Configure authentication credentials](#configure-authentication-credentials)
- [_Optional:_ Create a bucket](#create-a-bucket)

1.  {{< req text="Optional:" color="magenta" >}} **Download, install, and configure the `influx` CLI**.
    <span id="download-install-and-configure-the-influx-cli"></span>

    The `influx` CLI provides a simple way to interact with InfluxDB from a 
    command line. For detailed installation and setup instructions,
    see the [`influx` CLI reference](/influxdb3/cloud-serverless/reference/cli/influx/).

2.  **Create an All Access API token**.
    <span id="create-an-all-access-api-token"></span>

    1.  Go to [cloud2.influxdata.com](https://cloud2.influxdata.com) in a browser
        to log in and access the InfluxDB UI.

    2.  Navigate to **Load Data** > **API Tokens** using the left navigation bar.

        {{< nav-icon "load data" >}}

    3.  Click **+ {{% caps %}}Generate API token{{% /caps %}}** and select
        **All Access API Token**.
    4.  Enter a description for the API token and click **{{< icon "check" >}} {{% caps %}}Save{{% /caps %}}**.
    5.  Copy the generated token and store it for safe keeping.

    > [!Note]
    > We recommend using a password manager or a secret store to securely store
    > sensitive tokens.

3.  **Configure authentication credentials**.
<span id="configure-authentication-credentials"></span>

    As you go through this tutorial, interactions with InfluxDB {{< current-version >}}
    require your InfluxDB **URL** or **host**, **organization name or ID**, and your **API token**.
    There are different methods for providing these credentials depending on
    which client you use to interact with InfluxDB.

    > [!Note]
    > When configuring your token, if you [created an all access token](#create-an-all-access-api-token),
    > use that token to interact with InfluxDB. Otherwise, use your operator token.

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[Telegraf](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

When managing InfluxDB {{< current-version >}} through the InfluxDB UI,
authentication credentials are provided automatically using credentials
associated with the user you log in with.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

There are three ways to provide authentication credentials to the `influx` CLI:

{{< expand-wrapper >}}
{{% expand  "CLI connection configurations <em>(<span class=\"req\">Recommended</span>)</em>" %}}

The `influx` CLI lets you specify connection configuration presets that let
you store and quickly switch between multiple sets of InfluxDB connection
credentials. Use the [`influx config create` command](/influxdb3/cloud-serverless/reference/cli/influx/config/create/)
to create a new CLI connection configuration. Include the following flags:

- `-n, --config-name`: Connection configuration name. This examples uses `get-started`.
- `-u, --host-url`: [{{% product-name %}} region URL](/influxdb3/cloud-serverless/reference/regions/).
- `-o, --org`: InfluxDB [organization name](/influxdb3/cloud-serverless/admin/organizations/).
- `-t, --token`:  your [API token](/influxdb3/cloud-serverless/get-started/setup/#create-an-all-access-api-token).

{{% code-placeholders "API_TOKEN|ORG_NAME|https://{{< influxdb/host >}}|get-started" %}}
```sh
influx config create \
  --config-name get-started \
  --host-url https://{{< influxdb/host >}} \
  --org ORG_NAME \
  --token API_TOKEN
```
{{% /code-placeholders%}}

_For more information about CLI connection configurations, see the
[`influx config` command](/influxdb3/cloud-serverless/reference/cli/influx/config/)._

{{% /expand %}}

{{% expand "Environment variables" %}}

The `influx` CLI checks for specific environment variables and, if present,
uses those environment variables to populate authentication credentials.
Set the following environment variables in your command line session:

- `INFLUX_HOST`: [{{% product-name %}} region URL](/influxdb3/cloud-serverless/reference/regions/).
- `INFLUX_ORG`: InfluxDB [organization name or ID](/influxdb3/cloud-serverless/admin/organizations/view-orgs/).
- `INFLUX_TOKEN`:  your [API token](/influxdb3/cloud-serverless/get-started/setup/#create-an-all-access-api-token).

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[MacOS and Linux](#)
[PowerShell](#)
[CMD](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- BEGIN MACOS/LINUX -->
{{% code-placeholders "API_TOKEN|ORG_NAME" %}}
```sh
export INFLUX_HOST=https://{{< influxdb/host >}}
export INFLUX_ORG=ORG_NAME
export INFLUX_TOKEN=API_TOKEN
```
{{% /code-placeholders %}}
<!-- END MACOS/LINUX -->
{{% /code-tab-content %}}

{{% code-tab-content %}}
<!-- BEGIN POWERSHELL -->
{{% code-placeholders "API_TOKEN|ORG_NAME" %}}
```sh
$env:INFLUX_HOST = "https://{{< influxdb/host >}}"
$env:INFLUX_TOKEN = "API_TOKEN"
$env:INFLUX_ORG = "ORG_NAME"
```
{{% /code-placeholders %}}
<!-- END POWERSHELL -->
{{% /code-tab-content %}}

{{% code-tab-content %}}
<!-- BEGIN CMD -->
{{% code-placeholders "API_TOKEN|ORG_NAME" %}}
```sh
set INFLUX_HOST=https://{{< influxdb/host >}}
set INFLUX_ORG=ORG_NAME
set INFLUX_TOKEN=API_TOKEN
# Make sure to include a space character at the end of this command.
```
{{% /code-placeholders %}}
<!-- END CMD -->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
<!-- END WINDOWS -->

{{% /expand %}}

{{% expand "Command flags" %}}

Use the following `influx` CLI flags to provide required credentials to commands:

- `--host`: [{{% product-name %}} region URL](/influxdb3/cloud-serverless/reference/regions/).
- `-o`, `--org`: InfluxDB organization name or
  [ID](/influxdb3/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id).
- `-t`, `--token`:  your [API token](/influxdb3/cloud-serverless/get-started/setup/#create-an-all-access-api-token).

{{% /expand %}}
{{< /expand-wrapper >}}

> [!Note]
> All `influx` CLI examples in this getting started tutorial assume your InfluxDB
> **host**, **organization**, and **token** are provided by either the
> [active `influx` CLI configuration](/influxdb3/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials)
> or by environment variables.

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN TELEGRAF CONTENT ------------------------->

Telegraf examples in this getting started tutorial assumes you assigned an
`INFLUX_TOKEN` environment variable to your InfluxDB **token**.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[MacOS and Linux](#)
[PowerShell](#)
[CMD](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- BEGIN MACOS/LINUX -->
{{% code-placeholders "API_TOKEN" %}}
```sh
export INFLUX_TOKEN=API_TOKEN
```
{{% /code-placeholders %}}
<!-- END MACOS/LINUX -->
{{% /code-tab-content %}}

{{% code-tab-content %}}
<!-- BEGIN POWERSHELL -->
{{% code-placeholders "API_TOKEN" %}}
```sh
$env:INFLUX_TOKEN = "API_TOKEN"
```
{{% /code-placeholders %}}
<!-- END POWERSHELL -->
{{% /code-tab-content %}}

{{% code-tab-content %}}
<!-- BEGIN CMD -->
{{% code-placeholders "API_TOKEN" %}}
```sh
set INFLUX_TOKEN=API_TOKEN 
# Make sure to include a space character at the end of this command.
```
{{% /code-placeholders %}}
<!-- END CMD -->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
<!-- END WINDOWS -->

Replace the following:

- **`API_TOKEN`**: an InfluxDB [API token](/influxdb3/cloud-serverless/get-started/setup/#create-an-all-access-api-token) with sufficient permissions to your bucket

<!----------------------------- END TELEGRAF CONTENT ------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

API (cURL and client library) examples in this getting started tutorial assume you have
environment variables assigned to your InfluxDB credentials.

To assign environment variables to your credentials, enter the
following commands into your profile settings or terminal:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[MacOS and Linux](#)
[PowerShell](#)
[CMD](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- BEGIN MACOS/LINUX -->

{{% code-placeholders "API_TOKEN|ORG_NAME" %}}
```sh
export INFLUX_HOST=https://{{< influxdb/host >}}
export INFLUX_ORG=ORG_NAME
export INFLUX_TOKEN=API_TOKEN
```
{{% /code-placeholders %}}

<!-- END MACOS/LINUX -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- BEGIN POWERSHELL -->

{{% code-placeholders "API_TOKEN|ORG_NAME" %}}
```powershell
$env:INFLUX_HOST = "https://{{< influxdb/host >}}"
$env:INFLUX_ORG = "ORG_NAME"
$env:INFLUX_TOKEN = "API_TOKEN"
```
{{% /code-placeholders %}}

<!-- END POWERSHELL -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- BEGIN CMD -->

{{% code-placeholders "API_TOKEN|ORG_NAME" %}}
```sh
set INFLUX_HOST=https://{{< influxdb/host >}}
set INFLUX_ORG=ORG_NAME
set INFLUX_TOKEN=API_TOKEN 
# Make sure to include a space character at the end of this command.
```
{{% /code-placeholders %}}

<!-- END CMD -->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
<!-- END WINDOWS -->

Replace the following:

- **`ORG_NAME`**: your InfluxDB organization name
- **`ORG_ID`**: your InfluxDB organization ID
- **`API_TOKEN`**: an InfluxDB [API token](/influxdb3/cloud-serverless/get-started/setup/#create-an-all-access-api-token) with sufficient permissions to your bucket

Keep the following in mind when using API clients and client libraries:

- InfluxDB ignores `org` and `org_id` parameters in API write and query requests,
  but some clients still require the parameters.
- Some clients use `host` to refer to your _hostname_, your
  [{{% product-name %}} region URL](/influxdb3/cloud-serverless/reference/regions/)
  without `https://`.

> [!Note]
> All API, cURL, and client library examples in this getting started tutorial assume your InfluxDB
> **host**, **organization**, **url**, and **token** are provided by environment variables.

<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}} 

4.  {{< req text="Optional:" color="magenta" >}} **Create a bucket**.

    You can use an existing bucket or create a new one specifically for this
    getting started tutorial. All examples in this tutorial assume a bucket named
    **"get-started"**.

    Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to [create a
    bucket](/influxdb3/cloud-serverless/admin/buckets/create-bucket/).

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Go to [cloud2.influxdata.com](https://cloud2.influxdata.com) in a browser to
    log in and access the InfluxDB UI.

2.  Navigate to **Load Data** > **Buckets** using the left navigation bar.

{{< nav-icon "load data" >}}

3.  Click **+ {{< caps >}}Create bucket{{< /caps >}}**.
4.  Provide a bucket name (get-started) and select a
    [retention period](/influxdb3/cloud-serverless/reference/glossary/#retention-period).
    Supported retention periods depend on your {{% product-name %}} plan.

5.  Click **{{< caps >}}Create{{< /caps >}}**.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb3/cloud-serverless/reference/cli/influx/).
2.  Use the [`influx bucket create` command](/influxdb3/cloud-serverless/reference/cli/influx/bucket/create/)
    to create a new bucket.
    
    **Provide the following**:

    - `-n, --name` flag with the bucket name.
    - `-r, --retention` flag with the bucket's retention period duration.
      Supported retention periods depend on your {{% product-name %}} plan.
    - [Connection and authentication credentials](#configure-authentication-credentials)

  {{% code-placeholders "get-started|7d" %}}
```sh
influx bucket create \
  --name get-started \
  --retention 7d
```
  {{% /code-placeholders %}}

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

To create a bucket using the InfluxDB HTTP API, send a request to
the InfluxDB API `/api/v2/buckets` endpoint using the `POST` request method.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/buckets" method="post" api-ref="/influxdb3/cloud-serverless/api/#operation/PostBuckets" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token `INFLUX_TOKEN`
  - **Content-Type**: `application/json`
- **Request body**: JSON object with the following properties:
  - **org**: InfluxDB organization name
  - **name**: Bucket name
  - **retentionRules**: List of retention rule objects that define the bucket's retention period.
    Each retention rule object has the following properties:
    - **type**: `"expire"`
    - **everySeconds**: Retention period duration in seconds.
      Supported retention periods depend on your {{% product-name %}} plan.

{{% code-placeholders "\$INFLUX_TOKEN|\$INFLUX_ORG_ID|get-started"%}}
```sh
curl --request POST \
"https://{{< influxdb/host >}}/api/v2/buckets" \
  --header "Authorization: Token $INFLUX_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "orgID": "'"$INFLUX_ORG_ID"'",
    "name": "get-started",
    "retentionRules": [
      {
        "type": "expire",
        "everySeconds": 604800
      }
    ]
  }'
```
{{% /code-placeholders %}}

<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}} 

{{< page-nav prev="/influxdb3/cloud-serverless/get-started/" next="/influxdb3/cloud-serverless/get-started/write/" keepTab=true >}}
