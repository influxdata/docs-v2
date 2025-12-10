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

- [Run the initial setup process](#run-initial-setup-process)
- [Create an All Access API token](#create-an-all-access-api-token)
- [Configure authentication credentials](#configure-authentication-credentials)
- [Create a bucket](#create-a-bucket)

1. **Run the initial setup process**.
   <span id="run-initial-setup-process"></span>

   After you [install and start InfluxDB](/influxdb/v2/install/), run the initial setup process to create the following:

   - An [organization](/influxdb/v2/admin/organizations/) with the name you provide.
   - A [bucket](/influxdb/v2/admin/buckets/) with the name you provide.
   - An admin [authorization](/influxdb/v2/admin/tokens/) with the following properties:
     - The username and password that you provide.
     - An API [Operator token](/influxdb/v2/admin/tokens/#operator-token).
     - Read-write permissions for all resources in the InfluxDB instance.

   You can use the InfluxDB UI, the `influx` CLI, or the HTTP API to run the setup process.

   - To run an interactive setup that prompts you for the required information,
   use the InfluxDB user interface (UI) or the `influx` command line interface (CLI).

   - To automate the setup--for example, with a script that you write--
   use the `influx` command line interface (CLI) or the `/api/v2/setup` InfluxDB API endpoint.

   {{% note %}}
   #### Automated setup with Docker

   If you installed InfluxDB using [Docker with initial setup options](/influxdb/v2/install/?t=docker/#install-and-setup-influxdb-in-a-container), then you've already completed the setup process.

   {{% /note %}}

   {{< tabs-wrapper >}}
{{% tabs %}}
[Set up with the UI](#)
[Set up with the CLI](#)
[Set up with the API](#)
{{% /tabs %}}

<!------------------------------- BEGIN UI Setup ------------------------------>
{{% tab-content %}}

1. With InfluxDB running, visit <http://localhost:8086>.
2. Click **Get Started**

#### Set up your initial user

1. Enter a **Username** for your initial user.
2. Enter a **Password** and **Confirm Password** for your user.
3. Enter your initial **Organization Name**.
4. Enter your initial **Bucket Name**.
5. Click **Continue**.
6. Copy the provided **operator API token** and store it for safe keeping.

    {{% note %}}
We recommend using a password manager or a secret store to securely store
sensitive tokens.
    {{% /note %}}

Your InfluxDB instance is now initialized.

{{% /tab-content %}}
<!-------------------------------- END UI Setup ------------------------------->

<!------------------------------ BEGIN CLI Setup ------------------------------>
{{% tab-content %}}

1.  Download and install the `influx` CLI, which provides a simple way to interact with InfluxDB from a
    command line.
    For detailed installation and setup instructions,
    see [Use the influx CLI](/influxdb/v2/tools/influx-cli/).

2.  Use the `influx setup` CLI command to initialize your InfluxDB instance--choose one of the following:

    - **Set up with prompts**.
      To setup interactively, enter the following command:

      ```sh
      influx setup
      ```

      The command walks you through the initial setup process by prompting for a username, password, organization, bucket, and retention period.

    - **Set up non-interactively**.
      To run setup non-interactively (for example, in your automation scripts), pass [command line flags](/influxdb/v2/reference/cli/influx/setup/#flags) for the initialization values, and pass the `-f, --force` flag to bypass the final confirmation prompt--for example, enter the following command:

      <!--pytest.mark.skip-->

      ```sh
      influx setup \
        --username USERNAME \
        --password PASSWORD \
        --token TOKEN \
        --org ORG_NAME \
        --bucket BUCKET_NAME \
        --force
      ```

      Replace the following:

      - `USERNAME`: A name for your initial admin [user](/influxdb/v2/admin/users/)
      - `PASSWORD`: A password for your initial admin [user](/influxdb/v2/admin/users/)
      - `TOKEN`: A string value to set for the [_operator_ token](/influxdb/v2/admin/tokens/#operator-token).
        If you don't include this flag, InfluxDB generates a token for you and stores it in an
      [`influx` CLI connection configuration](/influxdb/v2/tools/influx-cli/#provide-required-authentication-credentials).
      - `ORG_NAME`: A name for your initial [organization](/influxdb/v2/admin/organizations/)
      - `BUCKET_NAME`: A name for your initial [bucket](/influxdb/v2/admin/buckets/)

    InfluxDB is initialized with an
    [Operator token](/influxdb/v2/admin/tokens/#operator-token),
    [user](/influxdb/v2/reference/glossary/#user),
    [organization](/influxdb/v2/reference/glossary/#organization),
    and [bucket](/influxdb/v2/reference/glossary/#bucket).
    The output is similar to the following:

    <!--pytest-codeblocks:expected-output-->

    ```sh
    User        Organization         Bucket
    USERNAME    ORGANIZATION_NAME    BUCKET_NAME
    ```

    InfluxDB stores these values in a `default` connection configuration that provides your
    InfluxDB URL, organization, and API token to `influx` CLI commands.
    For information about connection configurations, see [`influx config`](/influxdb/v2/reference/cli/influx/config/).

{{% /tab-content %}}
<!------------------------------- END CLI Setup -------------------------------->
<!------------------------------BEGIN API SETUP-------------------------------->
{{% tab-content %}}
Send a request to the following HTTP API endpoint:

{{< api-endpoint endpoint="http://localhost:8086/api/v2/setup" method="post" api-ref="/influxdb/v2/api/#operation/PostAuthorizations" >}}

{{% warn %}}

The `POST /api/v2/setup` API endpoint doesn't require authentication

{{% /warn %}}

In the request body, specify values for the initial username, password, organization, bucket, and an optional Operator token--for example:
{{% code-placeholders "BUCKET_NAME|ORG_NAME|USERNAME|PASSWORD|TOKEN" %}}

```sh
curl http://localhost:8090/api/v2/setup \
  --data '{
            "username": "USERNAME",
            "password": "PASSWORD",
            "token": "TOKEN",
            "bucket": "BUCKET_NAME",
            "org": "ORG_NAME"
        }'
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`USERNAME`{{% /code-placeholder-key %}}: A name for your initial admin [user](/influxdb/v2/admin/users/)
- {{% code-placeholder-key %}}`PASSWORD`{{% /code-placeholder-key %}}: A password for your initial admin [user](/influxdb/v2/admin/users/)
- {{% code-placeholder-key %}}`ORG_NAME`{{% /code-placeholder-key %}}: A name for your initial [organization](/influxdb/v2/admin/organizations/)
- {{% code-placeholder-key %}}`BUCKET_NAME`{{% /code-placeholder-key %}}: A name for your initial [bucket](/influxdb/v2/admin/buckets/)
- {{% code-placeholder-key %}}`TOKEN`{{% /code-placeholder-key %}}: A string value to set for the [_operator_ token](/influxdb/v2/admin/tokens/#operator-token).
      If you don't include this flag, InfluxDB generates a token for you.

The response body contains the created resources, including the [Operator token](/influxdb/v2/admin/tokens/#operator-token) and its list of permissions.

{{% note %}}
We recommend using a password manager or a secret store to securely store
sensitive tokens.
{{% /note %}}

For more options and details, see the [`POST /api/v2/setup` API endpoint documentation](/influxdb/v2/api/#operation/PostSetup).

{{% /tab-content%}}
<!----------------------------------END API SETUP------------------------------>
  {{< /tabs-wrapper >}}

1.  {{< req text="Recommended:" color="magenta" >}} **Create an All Access API token.**
    <span id="create-an-all-access-api-token"></span>

    During the [InfluxDB initial set up process](/influxdb/v2/install/#set-up-influxdb), you created an admin user and [Operator token](/influxdb/v2/admin/tokens/#operator-token)
    that have permissions to manage everything in your InfluxDB instance.

    While you can use your Operator token
    to interact with InfluxDB, we recommend creating an [All Access token](/influxdb/v2/admin/tokens/#all-access-token) that
    is scoped to an organization, and then using this token to manage InfluxDB.
    Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to create an All Access token.

    {{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Visit
    {{% show-in "v2" %}}[localhost:8086](http://localhost:8086){{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /show-in %}}
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
    to create an All Access token.

    Provide the following:

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

3. Copy the generated token and store it for safe keeping.

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

The following example uses cURL and the InfluxDB API to generate an All Access token:

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

3. **Configure authentication credentials**. <span id="configure-authentication-credentials"></span>

    As you go through this tutorial, interactions with InfluxDB {{< current-version >}}
    require your InfluxDB **host**, **organization name or ID**, and your **API token**.
    How you provide credentials depends on which client you use to interact with InfluxDB.

    {{% note %}}
When configuring your token, if you [created an All Access token](#create-an-all-access-api-token),
use that token to interact with InfluxDB.
Otherwise, use the Operator token that you created during the setup process.
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
credentials. A connection configuration stores your credentials to avoid having to pass your InfluxDB
API token with each `influx` command.

If you [set up InfluxDB](#set-up-influxdb) using the CLI, it creates a default
[connection configuration](/influxdb/v2/reference/cli/influx/config/) for you.

Use the [`influx config create` command](/influxdb/v2/reference/cli/influx/config/create/)
to manually create a new CLI connection configuration for the All Access token you created in the preceding step. Include the following flags:

{{% code-placeholders "API_TOKEN|ORG_NAME|http://localhost:8086|default|USERNAME|PASSWORD" %}}

```sh
influx config create \
  --config-name get-started \
  --host-url http://localhost:8086 \
  --org ORG_NAME \
  --token API_TOKEN
```

{{% /code-placeholders%}}

Replace the following:

- {{% code-placeholder-key %}}`get-started`{{% /code-placeholder-key %}}: Connection configuration name. Examples in this tutorial use `get-started`.
- {{% code-placeholder-key %}}`http://localhost:8086`{{% /code-placeholder-key %}}: [InfluxDB host URL](/influxdb/v2/reference/urls/).
- {{% code-placeholder-key %}}`ORG`{{% /code-placeholder-key %}}: [your organization name](/influxdb/v2/admin/organizations/view-orgs/).
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: [your API token](/influxdb/v2/admin/tokens/view-tokens/).

_For more information about `influx` CLI connection configurations, see
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

{{% code-placeholders "&lt;(ORG_NAME|ORG_ID|API_TOKEN)&gt;" %}}

```sh
export INFLUX_HOST={{< influxdb/host >}}
export INFLUX_ORG=<ORG_NAME>
export INFLUX_ORG_ID=<ORG_ID>
export INFLUX_TOKEN=<API_TOKEN>
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`<ORG_NAME>`{{% /code-placeholder-key %}}: The name of your [organization](/influxdb/v2/admin/organizations/)
- {{% code-placeholder-key %}}`<ORG_ID>`{{% /code-placeholder-key %}}: Your [organization ID](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id)
- {{% code-placeholder-key %}}`<API_TOKEN>`{{% /code-placeholder-key %}}: Your [All Access token](#create-an-all-access-api-token) or operator [token](/influxdb/v2/admin/tokens/)

{{% /expand %}}

{{% expand "Command line flags" %}}

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
- **InfluxDB API Token**: Include an `Authorization` header that uses either the
  `Bearer` or `Token` scheme and your InfluxDB [API token](/influxdb/v2/admin/tokens/)--for example:

  ```http
  Authorization: Bearer 0xxx0o0XxXxx00Xxxx000xXXxoo0==
  ```

- **InfluxDB organization name or ID**: Depending on the API endpoint used, pass
  this as part of the URL path, query string, or in the request body.

All API examples in this tutorial use **cURL** from a command line.
To provide all the necessary credentials to the example cURL commands, set
the following environment variables in your command line session.

{{% code-placeholders "&lt;(ORG_NAME|ORG_ID|API_TOKEN)&gt;" %}}

```sh
export INFLUX_HOST=http://localhost:8086
export INFLUX_ORG=<ORG_NAME>
export INFLUX_ORG_ID=<ORG_ID>
export INFLUX_TOKEN=<API_TOKEN>
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`<ORG_NAME>`{{% /code-placeholder-key %}}: The name of your [organization](/influxdb/v2/admin/organizations/)
- {{% code-placeholder-key %}}`<ORG_ID>`{{% /code-placeholder-key %}}: Your [organization ID](/influxdb/v2/admin/organizations/view-orgs/#view-your-organization-id)
- {{% code-placeholder-key %}}`<API_TOKEN>`{{% /code-placeholder-key %}}: Your [All Access token](#create-an-all-access-api-token) or Operator token
<!------------------------------ END API CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

1.  {{< req text="Optional:" color="magenta" >}} **Create a bucket**.
    <span id="create-a-bucket"></span>
    <span id="creating-a-database"></span>

    In the [initial setup process](#run-initial-setup-process), you created a bucket.
    You can use that bucket or create one specifically for this getting
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
    {{% show-in "v2" %}}[localhost:8086](http://localhost:8086){{% /show-in %}}
    {{% show-in "cloud,cloud-serverless" %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /show-in %}}
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
2.  Use the [`influx bucket create` command](/influxdb/v2/reference/cli/influx/bucket/create/) to create a bucket.

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

The following example shows how to use cURL and the InfluxDB API to create a bucket:

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
