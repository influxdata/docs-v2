---
title: Set up InfluxDB
seotitle: Set up InfluxDB | Get started with InfluxDB Cloud
list_title: Set up InfluxDB
description: >
  Learn how to set up InfluxDB for the "Get started with InfluxDB" tutorial.
menu:
  influxdb_cloud:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 5]
related:
  - /influxdb/cloud/reference/config-options/
  - /influxdb/cloud/admin/tokens/
  - /influxdb/cloud/organizations/buckets/
  - /influxdb/cloud/tools/influx-cli/
  - /influxdb/cloud/reference/api/
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

1.  {{< req text="(Optional)" color="magenta" >}} **Download, install, and configure the `influx` CLI**.
    
    The `influx` CLI provides a simple way to interact with InfluxDB from a 
    command line. For detailed installation and setup instructions,
    see [Use the influx CLI](/influxdb/cloud/tools/influx-cli/).

2.  **Create an All-Access API token.**
    <span id="create-an-all-access-api-token"></span>

    Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to create an
    All-Access token.

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Visit [cloud2.influxdata.com](https://cloud2.influxdata.com) in a browser to
    log in and access the InfluxDB UI.
2.  Navigate to **Load Data** > **API Tokens** using the left navigation bar.
3.  Click **+ {{% caps %}}Generate API token{{% /caps %}}** and select
    **All Access API Token**.
4.  Enter a description for the API token and click **{{< icon "check" >}} {{% caps %}}Save{{% /caps %}}**.
5.  Copy the generated token and store it for safe keeping.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/cloud/tools/influx-cli/).
2.  Use the [`influx auth create` command](/influxdb/cloud/reference/cli/influx/auth/create/)
    to create an All-Access token.
    
    **Provide the following**:

    - `--all-access` flag
    - `--host` flag with your [InfluxDB region URL](/influxdb/cloud/reference/regions/)
    - `-o, --org` or `--org-id` flags with your InfluxDB organization name or
      [ID](/influxdb/cloud/admin/organizations/view-orgs/#view-your-organization-id)
    - `-t, --token` flag with your Operator token

    ```sh
    influx auth create \
      --all-access \
      --host http://cloud2.influxdata.com \
      --org <YOUR_INFLUXDB_ORG_NAME> \
      --token <YOUR_INFLUXDB_OPERATOR_TOKEN>
    ```

3.  Copy the generated token and store it for safe keeping.

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

Send a request to the InfluxDB API `/api/v2/authorizations` endpoint using the `POST` request method.

{{< api-endpoint endpoint="http://cloud2.influxdata.com/api/v2/authorizations" method="post" api-ref="/influxdb/cloud/api/#post-/api/v2/authorizations" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_OPERATOR_TOKEN>
  - **Content-Type**: application/json
- **Request body**: JSON body with the following properties:
  - **status**: `"active"`
  - **description**: API token description
  - **orgID**: [InfluxDB organization ID](/influxdb/cloud/admin/organizations/view-orgs/#view-your-organization-id)
  - **permissions**: Array of objects where each object represents permissions
    for an InfluxDB resource type or a specific resource. Each permission contains the following properties:
      - **action**: "read" or "write"
      - **resource**: JSON object that represents the InfluxDB resource to grant
        permission to. Each resource contains at least the following properties:
          - **orgID**: [InfluxDB organization ID](/influxdb/cloud/admin/organizations/view-orgs/#view-your-organization-id)
          - **type**: Resource type.
            _For information about what InfluxDB resource types exist, use the
            [`/api/v2/resources` endpoint](/influxdb/cloud/api/#get-/api/v2/resources)._

The following example uses cURL and the InfluxDB API to generate an All-Access token:

{{% truncate %}}
```sh
export INFLUX_HOST=http://cloud2.influxdata.com
export INFLUX_ORG_ID=<YOUR_INFLUXDB_ORG_ID>
export INFLUX_TOKEN=<YOUR_INFLUXDB_OPERATOR_TOKEN>

curl --request POST \
"$INFLUX_HOST/api/v2/authorizations" \
  --header "Authorization: Token $INFLUX_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --data '{
    "status": "active",
    "description": "All access token for get started tutorial",
    "orgID": "'"$INFLUX_ORG_ID"'",
    "permissions": [
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "authorizations"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "authorizations"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "buckets"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "buckets"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "dashboards"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "dashboards"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "orgs"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "orgs"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "sources"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "sources"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "tasks"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "tasks"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "telegrafs"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "telegrafs"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "users"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "users"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "variables"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "variables"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "scrapers"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "scrapers"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "secrets"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "secrets"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "labels"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "labels"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "views"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "views"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "documents"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "documents"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "notificationRules"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "notificationRules"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "notificationEndpoints"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "notificationEndpoints"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "checks"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "checks"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "dbrp"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "dbrp"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "notebooks"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "notebooks"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "annotations"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "annotations"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "remotes"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "remotes"}},
      {"action": "read", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "replications"}},
      {"action": "write", "resource": {"orgID": "'"$INFLUX_ORG_ID"'", "type": "replications"}}
    ]
  }
'
```
{{% /truncate %}}

The response body contains a JSON object with the following properties:

- **id**: API Token ID
- **token**: API Token ({{< req "Important" >}})
- **status**: Token status
- **description**: Token description
- **orgID**: InfluxDB organization ID the token is associated with
- **org**: InfluxDB organization name the token is associated with
- **userID**: User ID the token is associated with
- **user**: Username the token is associated with
- **permissions**: List of permissions for organization resources

**Copy the generated `token` and store it for safe keeping.**

<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

    {{% note %}}
We recommend using a password manager or a secret store to securely store
sensitive tokens.
    {{% /note %}}

3. **Configure authentication credentials**. <span id="configure-authentication-credentials"></span>

    As you go through this tutorial, interactions with InfluxDB Cloud
    require your InfluxDB **host**, **organization name or ID**, and your **API token**.
    There are different methods for providing these credentials depending on
    which client you use to interact with InfluxDB.

    {{% note %}}
When configuring your token, use the [All-Access token you created](#create-an-all-access-api-token).
    {{% /note %}}

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

When managing InfluxDB through the InfluxDB UI, authentication credentials are
provided automatically using credentials associated with the user you log in with.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

There are three ways to provided authentication credentials to the `influx` CLI:

{{< expand-wrapper >}}
{{% expand  "CLI connection configurations <em>(<span class=\"req\">Recommended</span>)</em>" %}}

The `influx` CLI lets you specify connection configuration presets that let
you store and quickly switch between multiple sets of InfluxDB connection
credentials. Use the [`influx config create` command](/influxdb/cloud/reference/cli/influx/config/create/)
to create a new CLI connection configuration. Include the following flags:

  - `-n, --config-name`: Connection configuration name. This examples uses `get-started`.
  - `-u, --host-url`: [InfluxDB region URL](/influxdb/cloud/reference/regions/).
  - `-o, --org`: InfluxDB organization name.
  - `-t, --token`: InfluxDB API token.

```sh
influx config create \
  --config-name get-started \
  --host-url http://cloud2.influxdata.com \
  --org <YOUR_INFLUXDB_ORG_NAME> \
  --token <YOUR_INFLUXDB_API_TOKEN>
```

_For more information about CLI connection configurations, see
[Install and use the `influx` CLI](/influxdb/cloud/tools/influx-cli/#set-up-the-influx-cli)._

{{% /expand %}}

{{% expand "Environment variables" %}}

The `influx` CLI checks for specific environment variables and, if present,
uses those environment variables to populate authentication credentials.
Set the following environment variables in your command line session:

- `INFLUX_HOST`: [InfluxDB region URL](/influxdb/cloud/reference/urls/).
- `INFLUX_ORG`: InfluxDB organization name.
- `INFLUX_ORG_ID`: InfluxDB [organization ID](/influxdb/cloud/admin/organizations/view-orgs/#view-your-organization-id).
- `INFLUX_TOKEN`: InfluxDB API token.

```sh
export INFLUX_HOST=http://cloud2.influxdata.com
export INFLUX_ORG=<YOUR_INFLUXDB_ORG_NAME>
export INFLUX_ORG_ID=<YOUR_INFLUXDB_ORG_ID>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>
```

{{% /expand %}}

{{% expand "Command flags" %}}

Use the following `influx` CLI flags to provide required credentials to commands:

- `--host`: [InfluxDB region URL](/influxdb/cloud/reference/regions/).
- `-o`, `--org` or `--org-id`: InfluxDB organization name or
  [ID](/influxdb/cloud/admin/organizations/view-orgs/#view-your-organization-id).
- `-t`, `--token`: InfluxDB API token.

{{% /expand %}}
{{< /expand-wrapper >}}

{{% note %}}
All `influx` CLI examples in this getting started tutorial assume your InfluxDB
**host**, **organization**, and **token** are provided by either the
[active `influx` CLI configuration](/influxdb/cloud/reference/cli/influx/#provide-required-authentication-credentials)
or by environment variables.
{{% /note %}}

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

When using the InfluxDB API, provide the required connection credentials in the
following ways:

- **InfluxDB host**: Your [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/).
- **InfluxDB API Token**: Include an `Authorization` header that uses either 
  `Bearer` or `Token` scheme and your InfluxDB API token. For example:  
  `Authorization: Bearer 0xxx0o0XxXxx00Xxxx000xXXxoo0==`.
- **InfluxDB organization name or ID**: Depending on the API endpoint used, pass
  this as part of the URL path, query string, or in the request body.

All API examples in this tutorial use **cURL** from a command line.
To provide all the necessary credentials to the example cURL commands, set
the following environment variables in your command line session.

```sh
export INFLUX_HOST=http://cloud2.influxdata.com
export INFLUX_ORG=<YOUR_INFLUXDB_ORG_NAME>
export INFLUX_ORG_ID=<YOUR_INFLUXDB_ORG_ID>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>
```
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}} 

4.  **Create a bucket**.

    Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to create a
    new bucket.

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Visit [cloud2.influxdata.com](https://cloud2.influxdata.com) in a browser to
    log in and access the InfluxDB UI.
2.  Navigate to **Load Data** > **Buckets** using the left navigation bar.
3.  Click **+ {{< caps >}}Create bucket{{< /caps >}}**.
4.  Provide a bucket name (get-started) and select {{% caps %}}Never{{% /caps %}}
    to create a bucket with an infinite [retention period](/influxdb/cloud/reference/glossary/#retention-period).
5.  Click **{{< caps >}}Create{{< /caps >}}**.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/cloud/tools/influx-cli/).
2.  Use the [`influx bucket create` command](/influxdb/cloud/reference/cli/influx/bucket/create/)
    to create a new bucket.
    
    **Provide the following**:

    - `-n, --name` flag with the bucket name.
    - [Connection and authentication credentials](#configure-authentication-credentials)

    ```sh
    influx bucket create --name get-started
    ```

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

To create a bucket using the InfluxDB HTTP API, send a request to
the InfluxDB API `/api/v2/buckets` endpoint using the `POST` request method.

{{< api-endpoint endpoint="http://cloud2.influxdata.com/api/v2/buckets" method="post" api-ref="/influxdb/cloud/api/#post-/api/v2/buckets" >}}

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
      `0` indicates the retention period is infinite. 

```sh
export INFLUX_HOST=http://cloud2.influxdata.com
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
        "everySeconds": 0
      }
    ]
  }'
```
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}} 

{{< page-nav prev="/influxdb/cloud/get-started/" next="/influxdb/cloud/get-started/write/" keepTab=true >}}
