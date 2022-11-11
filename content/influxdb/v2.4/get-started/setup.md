---
title: Set up InfluxDB
seotitle: Set up InfluxDB | Get started with InfluxDB
list_title: Set up InfluxDB
description: >
  Learn how to set up InfluxDB for the "Get started with InfluxDB" tutorial.
menu:
  influxdb_2_4:
    name: Set up InfluxDB
    parent: Get started
    identifier: get-started-set-up
weight: 101
metadata: [1 / 5]
---

As you get started with this tutorial, do the following to make sure everything
you need is in place.

1.  If you haven't already, [download and install InfluxDB](/influxdb/v2.4/install/).

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
see [InfluxDB configuration options](/influxdb/v2.4/reference/config-options/).
    {{% /note %}}

    Once running, the InfluxDB UI is accessible at [localhost:8086](http://localhost:8086).

3.  {{< req text="(Optional)" color="magenta" >}} **Download, install, and configure the `influx` CLI**.
    
    The `influx` CLI provides a simple way to interact with InfluxDB from a 
    command line. For detailed installation and setup instructions,
    see [Use the influx CLI](/influxdb/v2.4/tools/influx-cli/).

4.  {{< req text="(Optional)" color="magenta" >}} **Create an All Access API token.**

    During the InfluxDB initialization process, you created a user and API token
    that has permissions to manage everything in your InfluxDB instance.
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

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/v2.4/tools/influx-cli/).
2.  Use the [`influx auth create` command](/influxdb/v2.4/reference/cli/influx/auth/create/)
    to create an all access token.
    
    **Provide the following**:

    - `--all-access` flag
    - Operator token to authorize the request

    {{< cli/influx-creds-note >}}

    ```sh
    influx auth create --all-access
    ```

3.  Copy the generated token and store it for safe keeping.

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

Send a request to the InfluxDB API `/api/v2/authorizations` endpoint using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/authorizations" method="post" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_OPERATOR_TOKEN>
  - **Content-Type**: application/json
- **Request body**: JSON body with the following properties:
  - **status**: `"active"`
  - **description**: API token description
  - **orgID**: [InfluxDB organization ID](/influxdb/v2.4/organizations/view-orgs/#view-your-organization-id)
  - **permissions**: Array of objects where each object represents permissions
    for an InfluxDB resource type or a specific resource. Each permission contains the following properties:
      - **action**: "read" or "write"
      - **resource**: JSON object that represents the InfluxDB resource to grant
        permission to. Each resource contains at least the following properties:
          - **orgID**: [InfluxDB organization ID](/influxdb/v2.4/organizations/view-orgs/#view-your-organization-id)
          - **type**: Resource type.
            _For information about what InfluxDB resource types exist, use the
            [`/api/v2/resources` endpoint](/influxdb/v2.4/api/#operation/GetResources)._

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

5.  {{< req text="(Optional)" color="magenta" >}} **Create a bucket**

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
    to create a bucket with an infinite [retention period](/influxdb/v2.4/reference/glossary/#retention-period).
5.  Click **{{< caps >}}Create{{< /caps >}}**.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/v2.4/tools/influx-cli/).
2.  Use the [`influx bucket create` command](/influxdb/v2.4/reference/cli/influx/bucket/create/)
    to create a new bucket.
    
    **Provide the following**:

    - `-n, --name` flag with the bucket name.

    {{< cli/influx-creds-note >}}

    ```sh
    influx bucket create --name get-started
    ```

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN API CONTENT ----------------------------->

To create a bucket using the InfluxDB HTTP API, send a request to
the InfluxDB API `/api/v2/buckets` endpoint using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/buckets" method="post" >}}

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

{{< page-nav prev="/influxdb/v2.4/get-started/" next="/influxdb/v2.4/get-started/write/" keepTab=true >}}

<!-- 
*Note:** To run InfluxDB, start the `influxd` daemon ([InfluxDB service](/influxdb/v2.4/reference/cli/influxd/)) using the [InfluxDB command line interface](/influxdb/v2.4/reference/cli/influx/). Once you've started the `influxd` daemon, use `localhost:8086` to log in to your InfluxDB instance.

To start InfluxDB, do the following:
  1. Open a terminal.
  2. Type `influxd` in the command line.

```sh
influxd
```
-->