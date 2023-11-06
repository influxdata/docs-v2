---
title: Set up InfluxDB
seotitle: Set up InfluxDB | Get started with InfluxDB
list_title: Set up InfluxDB
description: >
  Learn how to set up InfluxDB for the "Get started with InfluxDB" tutorial.
menu:
  influxdb_v2:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 5]
related:
  - /influxdb/v2/install/
  - /influxdb/v2/reference/config-options/
  - /influxdb/v2/admin/tokens/
  - /influxdb/v2/admin/buckets/
  - /influxdb/v2/tools/influx-cli/
  - /influxdb/v2/reference/api/
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

1.  If you haven't already, [download, install, and set up InfluxDB {{< current-version >}}](/influxdb/v2/install/).

    Installation instructions depend on your operating system.
    Be sure to go through the installation and initialization process fully.

2.  **Start InfluxDB**.

    Run the `influxd` daemon to start the InfluxDB service, HTTP API, and 
    user interface (UI).

    ```sh
    influxd
    ```

     {{% note %}}
#### Configure InfluxDB

There are multiple ways to custom-configure InfluxDB.
For information about what configuration options are available and how to set them,
see [InfluxDB configuration options](/influxdb/v2/reference/config-options/).
    {{% /note %}}

    Once running, the InfluxDB UI is accessible at [localhost:8086](http://localhost:8086).

3.  **Set up and initialize InfluxDB**.

    If starting InfluxDB for the first time, use the InfluxDB UI or the `influx`
    CLI to initialize your InfluxDB instance.
    This process creates a default user, organization, and bucket and provides
    you with an [operator token](/influxdb/v2/admin/tokens/#operator-token)
    for managing your InfluxDB instance.

    For detailed instructions, see [Install InfluxDB – Set up InfluxDB](/influxdb/v2/install/#set-up-influxdb).

4.  {{< req text="(Optional)" color="magenta" >}} **Download, install, and configure the `influx` CLI**.
    
    The `influx` CLI provides a simple way to interact with InfluxDB from a 
    command line. For detailed installation and setup instructions,
    see [Use the influx CLI](/influxdb/v2/tools/influx-cli/).

5.  {{< req text="(Optional)" color="magenta" >}} **Create an All Access API token.**
    <span id="create-an-all-access-api-token"></span>

    During the [InfluxDB initialization process](/influxdb/v2/install/#set-up-influxdb),
    you created a user and API token that has permissions to manage everything in your InfluxDB instance.
    This is known as an **Operator token**. While you can use your Operator token
    to interact with InfluxDB, we recommend creating an **all access token** that
    is scoped to an organization.

    Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to create an
    all access token.

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Visit
    {{% oss-only %}}[localhost:8086](http://localhost:8086){{% /oss-only %}}
    {{% cloud-only %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /cloud-only %}}
    in a browser to log in and access the InfluxDB UI.

2.  Navigate to **Load Data** > **API Tokens** using the left navigation bar.
3.  Click **+ {{% caps %}}Generate API token{{% /caps %}}** and select
    **All Access API Token**.
4.  Enter a description for the API token and click **{{< icon "check" >}} {{% caps %}}Save{{% /caps %}}**.
5.  Copy the generated token and store it for safe keeping.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/v2/tools/influx-cli/).
2.  Use the [`influx auth create` command](/influxdb/v2/reference/cli/influx/auth/create/)
    to create an all access token.
    
    **Provide the following**:

    - `--all-access` flag
    - `--host` flag with your [InfluxDB host URL](/influxdb/v2/reference/urls/)
    - `-o, --org` or `--org-id` flags with your InfluxDB organization name or
      [ID](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id)
    - `-t, --token` flag with your Operator token

    ```sh
    influx auth create \
      --all-access \
      --host http://localhost:8086 \
      --org <YOUR_INFLUXDB_ORG_NAME> \
      --token <YOUR_INFLUXDB_OPERATOR_TOKEN>
    ```

3.  Copy the generated token and store it for safe keeping.

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

Send a request to the InfluxDB API `/api/v2/authorizations` endpoint using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/authorizations" method="post" api-ref="/influxdb/v2/api/#operation/PostAuthorizations" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_OPERATOR_TOKEN>
  - **Content-Type**: application/json
- **Request body**: JSON body with the following properties:
  - **status**: `"active"`
  - **description**: API token description
  - **orgID**: [InfluxDB organization ID](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id)
  - **permissions**: Array of objects where each object represents permissions
    for an InfluxDB resource type or a specific resource. Each permission contains the following properties:
      - **action**: "read" or "write"
      - **resource**: JSON object that represents the InfluxDB resource to grant
        permission to. Each resource contains at least the following properties:
          - **orgID**: [InfluxDB organization ID](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id)
          - **type**: Resource type.
            _For information about what InfluxDB resource types exist, use the
            [`/api/v2/resources` endpoint](/influxdb/v2/api/#operation/GetResources)._

The following example uses cURL and the InfluxDB API to generate an all access token:

{{% truncate %}}
```sh
export INFLUX_HOST=http://localhost:8086
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

6. **Configure authentication credentials**. <span id="configure-authentication-credentials"></span>

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
credentials. Use the [`influx config create` command](/influxdb/v2/reference/cli/influx/config/create/)
to create a new CLI connection configuration. Include the following flags:

  - `-n, --config-name`: Connection configuration name. This examples uses `get-started`.
  - `-u, --host-url`: [InfluxDB host URL](/influxdb/v2/reference/urls/).
  - `-o, --org`: InfluxDB organization name.
  - `-t, --token`: InfluxDB API token.

```sh
influx config create \
  --config-name get-started \
  --host-url http://localhost:8086 \
  --org <YOUR_INFLUXDB_ORG_NAME> \
  --token <YOUR_INFLUXDB_API_TOKEN>
```

_For more information about CLI connection configurations, see
[Install and use the `influx` CLI](/influxdb/v2/tools/influx-cli/#set-up-the-influx-cli)._

{{% /expand %}}

{{% expand "Environment variables" %}}

The `influx` CLI checks for specific environment variables and, if present,
uses those environment variables to populate authentication credentials.
Set the following environment variables in your command line session:

- `INFLUX_HOST`: [InfluxDB host URL](/influxdb/v2/reference/urls/).
- `INFLUX_ORG`: InfluxDB organization name.
- `INFLUX_ORG_ID`: InfluxDB [organization ID](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id).
- `INFLUX_TOKEN`: InfluxDB API token.

```sh
export INFLUX_HOST=http://localhost:8086
export INFLUX_ORG=<YOUR_INFLUXDB_ORG_NAME>
export INFLUX_ORG_ID=<YOUR_INFLUXDB_ORG_ID>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>
```

{{% /expand %}}

{{% expand "Command flags" %}}

Use the following `influx` CLI flags to provide required credentials to commands:

- `--host`: [InfluxDB host URL](/influxdb/v2/reference/urls/).
- `-o`, `--org` or `--org-id`: InfluxDB organization name or
  [ID](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id).
- `-t`, `--token`: InfluxDB API token.

{{% /expand %}}
{{< /expand-wrapper >}}

{{% note %}}
All `influx` CLI examples in this getting started tutorial assume your InfluxDB
**host**, **organization**, and **token** are provided by either the
[active `influx` CLI configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials)
or by environment variables.
{{% /note %}}

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

When using the InfluxDB API, provide the required connection credentials in the
following ways:

- **InfluxDB host**: The domain and port to send HTTP(S) requests to.
- **InfluxDB API Token**: Include an `Authorization` header that uses either 
  `Bearer` or `Token` scheme and your InfluxDB API token. For example:  
  `Authorization: Bearer 0xxx0o0XxXxx00Xxxx000xXXxoo0==`.
- **InfluxDB organization name or ID**: Depending on the API endpoint used, pass
  this as part of the URL path, query string, or in the request body.

All API examples in this tutorial use **cURL** from a command line.
To provide all the necessary credentials to the example cURL commands, set
the following environment variables in your command line session.

```sh
export INFLUX_HOST=http://localhost:8086
export INFLUX_ORG=<YOUR_INFLUXDB_ORG_NAME>
export INFLUX_ORG_ID=<YOUR_INFLUXDB_ORG_ID>
export INFLUX_TOKEN=<YOUR_INFLUXDB_API_TOKEN>
```
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}} 

7.  {{< req text="(Optional)" color="magenta" >}} **Create a bucket**.

    In the InfluxDB initialization process, you created a bucket.
    You can use that bucket or create a new one specifically for this getting
    started tutorial. All examples in this tutorial assume a bucket named
    _get-started_.

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

1.  Visit
    {{% oss-only %}}[localhost:8086](http://localhost:8086){{% /oss-only %}}
    {{% cloud-only %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /cloud-only %}}
    in a browser to log in and access the InfluxDB UI.

2.  Navigate to **Load Data** > **Buckets** using the left navigation bar.
3.  Click **+ {{< caps >}}Create bucket{{< /caps >}}**.
4.  Provide a bucket name (get-started) and select {{% caps %}}Never{{% /caps %}}
    to create a bucket with an infinite [retention period](/influxdb/v2/reference/glossary/#retention-period).
5.  Click **{{< caps >}}Create{{< /caps >}}**.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/v2/tools/influx-cli/).
2.  Use the [`influx bucket create` command](/influxdb/v2/reference/cli/influx/bucket/create/)
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

{{< api-endpoint endpoint="http://localhost:8086/api/v2/buckets" method="post" api-ref="/influxdb/v2/api/#operation/PostBuckets">}}

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
export INFLUX_HOST=http://localhost:8086
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

{{< page-nav prev="/influxdb/v2/get-started/" next="/influxdb/v2/get-started/write/" keepTab=true >}}
