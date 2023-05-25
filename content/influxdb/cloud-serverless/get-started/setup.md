---
title: Set up InfluxDB
seotitle: Set up InfluxDB | Get started with InfluxDB
list_title: Set up InfluxDB
description: >
  Learn how to set up InfluxDB for the "Get started with InfluxDB" tutorial.
menu:
  influxdb_cloud_serverless:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 3]
related:
  - /influxdb/cloud-serverless/security/tokens/
  - /influxdb/cloud-serverless/security/tokens/create-token/
  - /influxdb/cloud-serverless/security/tokens/view-tokens/
  - /influxdb/cloud-serverless/admin/buckets/
  - /influxdb/cloud-serverless/reference/cli/influx/
  - /influxdb/cloud-serverless/reference/api/
aliases:
  - /influxdb/cloud-serverless/security/tokens/
  - /influxdb/cloud-serverless/security/tokens/create-token/
  - /influxdb/cloud-serverless/security/tokens/view-tokens/
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

1.  {{< req text="(Optional)" color="magenta" >}} **Download, install, and configure the `influx` CLI**.
    
    The `influx` CLI provides a simple way to interact with InfluxDB from a 
    command line. For detailed installation and setup instructions,
    see [Use the influx CLI](/influxdb/cloud-serverless/tools/influx-cli/).

2.  **Create an All Access API token.**
    <span id="create-an-all-access-api-token"></span>

    1.  Go to
        {{% oss-only %}}[localhost:8086](https://cloud2.influxdata.com){{% /oss-only %}}
        {{% cloud-only %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /cloud-only %}}
        in a browser to log in and access the InfluxDB UI.

    2.  Navigate to **Load Data** > **API Tokens** using the left navigation bar.

        {{< nav-icon "load data" >}}

    3.  Click **+ {{% caps %}}Generate API token{{% /caps %}}** and select
        **All Access API Token**.
    4.  Enter a description for the API token and click **{{< icon "check" >}} {{% caps %}}Save{{% /caps %}}**.
    5.  Copy the generated token and store it for safe keeping.

    {{% note %}}
We recommend using a password manager or a secret store to securely store
sensitive tokens.
    {{% /note %}}

3. **Configure authentication credentials**. <span id="configure-authentication-credentials"></span>

    As you go through this tutorial, interactions with InfluxDB {{< current-version >}}
    require your InfluxDB **host**, **organization name or ID**, and your **API token**.
    There are different methods for providing these credentials depending on
    which client you use to interact with InfluxDB.

    {{% note %}}
When configuring your token, if you [created an all access token](#create-an-all-access-api-token),
use that token to interact with InfluxDB. Otherwise, use your operator token.
    {{% /note %}}

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
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

There are three ways to provided authentication credentials to the `influx` CLI:

{{< expand-wrapper >}}
{{% expand  "CLI connection configurations <em>(<span class=\"req\">Recommended</span>)</em>" %}}

The `influx` CLI lets you specify connection configuration presets that let
you store and quickly switch between multiple sets of InfluxDB connection
credentials. Use the [`influx config create` command](/influxdb/cloud-serverless/reference/cli/influx/config/create/)
to create a new CLI connection configuration. Include the following flags:

- `-n, --config-name`: Connection configuration name. This examples uses `get-started`.
- `-u, --host-url`: [InfluxDB Cloud Serverless region URL](/influxdb/cloud-serverless/reference/regions/).
- `-o, --org`: InfluxDB organization name.
- `-t, --token`: InfluxDB API token.

```sh
influx config create \
  --config-name get-started \
  --host-url https://cloud2.influxdata.com \
  --org <YOUR_INFLUXDB_ORG_NAME> \
  --token <YOUR_INFLUXDB_API_TOKEN>
```

_For more information about CLI connection configurations, see
[Install and use the `influx` CLI](/influxdb/cloud-serverless/tools/influx-cli/#set-up-the-influx-cli)._

{{% /expand %}}

{{% expand "Environment variables" %}}

The `influx` CLI checks for specific environment variables and, if present,
uses those environment variables to populate authentication credentials.
Set the following environment variables in your command line session:

- `INFLUX_HOST`: [InfluxDB Cloud Serverless region URL](/influxdb/cloud-serverless/reference/regions/).
- `INFLUX_ORG`: InfluxDB organization name.
- `INFLUX_ORG_ID`: InfluxDB [organization ID](/influxdb/cloud-serverless/organizations/view-orgs/#view-your-organization-id).
- `INFLUX_TOKEN`: InfluxDB API token.

```sh
export INFLUX_HOST=https://cloud2.influxdata.com
export INFLUX_ORG=<YOUR_INFLUXDB_ORG_NAME>
export INFLUX_ORG_ID=<YOUR_INFLUXDB_ORG_ID>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>
```

{{% /expand %}}

{{% expand "Command flags" %}}

Use the following `influx` CLI flags to provide required credentials to commands:

- `--host`: [InfluxDB Cloud Serverless region URL](/influxdb/cloud-serverless/reference/regions/).
- `-o`, `--org` or `--org-id`: InfluxDB organization name or
  [ID](/influxdb/cloud-serverless/organizations/view-orgs/#view-your-organization-id).
- `-t`, `--token`: InfluxDB API token.

{{% /expand %}}
{{< /expand-wrapper >}}

{{% note %}}
All `influx` CLI examples in this getting started tutorial assume your InfluxDB
**host**, **organization**, and **token** are provided by either the
[active `influx` CLI configuration](/influxdb/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials)
or by environment variables.
{{% /note %}}

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

When using the InfluxDB API, provide the required connection credentials in the
following ways:

- **InfluxDB host**: [InfluxDB Cloud Serverless region URL](/influxdb/cloud-serverless/reference/regions/)
- **InfluxDB API Token**: Include an `Authorization` header that uses either 
  `Bearer` or `Token` scheme and your InfluxDB API token. For example:  
  `Authorization: Bearer 0xxx0o0XxXxx00Xxxx000xXXxoo0==`.
- **InfluxDB organization name or ID**: Depending on the API endpoint used, pass
  this as part of the URL path, query string, or in the request body.

All API examples in this tutorial use **cURL** from a command line.
To provide all the necessary credentials to the example cURL commands, set
the following environment variables in your command line session.

```sh
export INFLUX_HOST=https://cloud2.influxdata.com
export INFLUX_ORG=<YOUR_INFLUXDB_ORG_NAME>
export INFLUX_ORG_ID=<YOUR_INFLUXDB_ORG_ID>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>
```
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}} 

6.  {{< req text="(Optional)" color="magenta" >}} **Create a bucket**.

    You can use an existing bucket or create a new one specifically for this
    getting started tutorial. All examples in this tutorial assume a bucket named
    **"get-started"**.

    Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to [create a
    bucket](/influxdb/cloud-serverless/admin/buckets/create-bucket/).

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Go to
    {{% oss-only %}}[localhost:8086](https://cloud2.influxdata.com){{% /oss-only %}}
    {{% cloud-only %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /cloud-only %}}
    in a browser to log in and access the InfluxDB UI.

2.  Navigate to **Load Data** > **Buckets** using the left navigation bar.

{{< nav-icon "load data" >}}

3.  Click **+ {{< caps >}}Create bucket{{< /caps >}}**.
4.  Provide a bucket name (get-started) and select a
    [retention period](/influxdb/cloud-serverless/reference/glossary/#retention-period).
    Supported retention periods depend on your InfluxDB Cloud Serverless plan.

5.  Click **{{< caps >}}Create{{< /caps >}}**.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/cloud-serverless/tools/influx-cli/).
2.  Use the [`influx bucket create` command](/influxdb/cloud-serverless/reference/cli/influx/bucket/create/)
    to create a new bucket.
    
    **Provide the following**:

    - `-n, --name` flag with the bucket name.
    - `-r, --retention` flag with the bucket's retention period duration.
      Supported retention periods depend on your InfluxDB Cloud Serverless plan.
    - [Connection and authentication credentials](#configure-authentication-credentials)

    ```sh
    influx bucket create \
      --name get-started \
      --retention 7d
    ```

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

To create a bucket using the InfluxDB HTTP API, send a request to
the InfluxDB API `/api/v2/buckets` endpoint using the `POST` request method.

{{< api-endpoint endpoint="https://cloud2.influxdata.com/api/v2/buckets" method="post" api-ref="/influxdb/cloud-serverless/api/#operation/PostBuckets" >}}

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
      Supported retention periods depend on your InfluxDB Cloud Serverless plan.

```sh
export INFLUX_HOST=https://cloud2.influxdata.com
export INFLUX_ORG_ID=<YOUR_INFLUXDB_ORG_ID>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>

curl --request POST \
"$INFLUX_HOST/api/v2/buckets" \
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
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}} 

{{< page-nav prev="/influxdb/cloud-serverless/get-started/" next="/influxdb/cloud-serverless/get-started/write/" keepTab=true >}}
