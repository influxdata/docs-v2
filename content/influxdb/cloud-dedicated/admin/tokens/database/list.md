---
title: List database tokens
description: >
  Use the [`influxctl token list` command](/influxdb/cloud-dedicated/reference/cli/influxctl/token/list/)
  or the [Management HTTP API](/influxdb/cloud-dedicated/api/management/)
  to list database tokens in your InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: Database tokens
weight: 202
list_code_example: |
  ##### CLI
  ```sh
  influxctl token list
  ```

  ##### API
  ```sh
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
    --header "Accept: application/json" \
    --header "Authorization: Bearer MANAGEMENT_TOKEN"
  ```

  ```sh
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
    --header "Accept: application/json" \
    --header "Authorization: Bearer MANAGEMENT_TOKEN"
  ```
aliases:
  - /influxdb/cloud-dedicated/admin/tokens/list/
related:
  - /influxdb/cloud-dedicated/reference/cli/influxctl/token/list/
  - /influxdb/cloud-dedicated/reference/api/
---

Use the [`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/)
or the [Management HTTP API](influxdb/cloud-dedicated/api/management/)
to list database tokens in your {{< product-name omit=" Clustered" >}} cluster.

[List database tokens](#list-database-tokens)
[Retrieve a database token by ID](#retrieve-a-database-token-by-id)

## List database tokens

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXCTL ----------------------------->
1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure an `influxctl` connection profile](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.2.  In your terminal, run the `influxctl token list` command and provide the following:

    - _Optional_: [Output format](#output-formats)

    ```sh
    influxctl token list --format table
    ```

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->
_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

   {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" method="get" api-ref="/influxdb/cloud-dedicated/api/management/#operation/GetDatabaseTokens" %}}

   In the URL, provide the following credentials:

   - `ACCOUNT_ID`: The ID of the [account](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that the cluster belongs to _(see how to [list cluster details](/influxdb/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `CLUSTER_ID`: The ID of the [cluster](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that you want to manage _(see how to [list cluster details](/influxdb/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.

   Provide the following request headers:

   - `Accept: application/json` to ensure the response body is JSON content
   - `Authorization: Bearer` and a [Management API token](/influxdb/cloud-dedicated/admin/tokens/management/) for your cluster _(see how to [create a management token](/influxdb/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

The following example shows how to use the Management API to list database tokens:

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
   --header "Accept: application/json" \
   --header "Authorization: Bearer MANAGEMENT_TOKEN"
```

{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster

## Retrieve a database token by ID

To retrieve a specific database token by ID, send a request to the following {{% product-name %}} endpoint:

   {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" method="get" api-ref="/influxdb/cloud-dedicated/api/management/#operation/GetDatabaseToken" %}}

   In the URL, provide the following:

   - `ACCOUNT_ID`: The ID of the [account](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that the cluster belongs to _(see how to [list cluster details](/influxdb/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `CLUSTER_ID`: The ID of the [cluster](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that you want to manage _(see how to [list cluster details](/influxdb/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `TOKEN_ID`: The ID of the database [token](/influxdb/cloud-dedicated/admin/tokens/database) that you want to retrieve _(see how to [list token details](/influxdb/cloud-dedicated/admin/tokens/database/list/#detailed-output-in-json))_.

   Provide the following request headers:

   - `Accept: application/json` to ensure the response body is JSON content
   - `Authorization: Bearer` and a [Management API token](/influxdb/cloud-dedicated/admin/tokens/management/) for your cluster _(see how to [create a management token](/influxdb/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

{{% code-placeholders "TOKEN_ID|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
 --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
 --header "Accept: application/json" \
 --header "Authorization: Bearer MANAGEMENT_TOKEN" \
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}: a [database token](/influxdb/cloud-dedicated/admin/tokens/database/) ID

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Output formats

The `influxctl token list` command supports two output formats: `table` and `json`.
By default, the command outputs the list of tokens formatted as a table.

The Management API outputs JSON format in the response body.

#### Detailed output in JSON

For additional token details and easier programmatic access to the command output, include `--format json`
with your command to format the list as JSON.

```sh
influxctl token list --format json
```

The output is a JSON array of token objects that include additional fields such as token ID and permissions.

#### Example output

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[table](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```sh
+--------------------------------------+----------------------+
| ID                                   | DESCRIPTION          |
+--------------------------------------+----------------------+
| 000x0000-000x-0000-X0x0-X0X00000x000 | read/write for mydb1 |
| 000x000X-Xx0X-0000-0x0X-000xX000xx00 | read-only for mydb2  |
| 00XXxXxx-000X-000X-x0Xx-00000xx00x00 | write-only for mydb3  |
+--------------------------------------+----------------------+
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```json
[
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "id": "000x0000-000x-0000-X0x0-X0X00000x000",
    "description": "read/write for mydb1",
    "permissions": [
      {
        "id": "00000000-0000-0000-0000-000000000000",
        "action": "read",
        "resource": "mydb1"
      }
    ],
  },
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "id": "000x000X-Xx0X-0000-0x0X-000xX000xx00",
    "description": "read-only for mydb2",
    "permissions": [
      {
        "id": "00000000-0000-0000-0000-000000000000",
        "action": "read",
        "resource": "mydb2"
      }
  ],
  },
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "id": "00XXxXxx-000X-000X-x0Xx-00000xx00x00",
    "description": "write-only for mydb3",
    "permissions": [
      {
        "id": "00000000-0000-0000-0000-000000000000",
        "action": "read",
        "resource": "mydb3"
      }
  ],
  }
]
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
