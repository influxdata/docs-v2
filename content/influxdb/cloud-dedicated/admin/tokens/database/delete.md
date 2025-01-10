---
title: Delete a database token
description: >
  Use the [`influxctl token delete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/delete/)
  or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  to delete a database token from your InfluxDB Cloud Dedicated cluster and revoke all
  permissions associated with the token.
  Provide the ID of the database token you want to delete.
menu:
  influxdb3_cloud_dedicated:
    parent: Database tokens
weight: 203
list_code_example: |
  ##### CLI
  ```sh
  influxctl token delete <TOKEN_ID>
  ```

  ##### API
  ```sh
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
    --request DELETE \
    --header "Accept: application/json" \
    --header "Authorization: Bearer $MANAGEMENT_TOKEN" \
  ```
aliases:
  - /influxdb3/cloud-dedicated/admin/tokens/delete/
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/token/delete/
  - /influxdb3/cloud-dedicated/reference/api/
---

Use the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/)
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
to delete a database token from your {{< product-name omit=" Clustered" >}} cluster.

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXCTL ----------------------------->
Use the [`influxctl token delete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/delete/)
to delete a database token from your {{% product-name omit="Clustered" %}} cluster and revoke
all permissions associated with the token.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure an `influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.
2.  To list token IDs, run the [`influxctl token list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/list) in your terminal.

    ```sh
    influxctl token list
    ```

    Copy the **token ID** of the token you want to delete.

3.  Run the `influxctl token delete` command and provide the following:

    - Token ID to delete

4.  Confirm that you want to delete the token.

{{% code-placeholders "TOKEN_ID" %}}

```sh
influxctl token delete TOKEN_ID
```

{{% /code-placeholders %}}

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->
_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

   {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" method="delete" api-ref="/influxdb3/cloud-dedicated/api/management/#operation/DeleteDatabaseToken" %}}

   In the URL, provide the following:

   - `ACCOUNT_ID`: The ID of the [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that the cluster belongs to _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `CLUSTER_ID`: The ID of the [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that you want to manage _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `TOKEN_ID`: The ID of the database [token](/influxdb3/cloud-dedicated/admin/tokens/database) that you want to delete _(see how to [list token details](/influxdb3/cloud-dedicated/admin/tokens/database/list/#detailed-output-in-json))_.

   Provide the following request headers:
   - `Accept: application/json` to ensure the response body is JSON content
   - `Authorization: Bearer` and a [Management API token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your cluster _(see how to [create a management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

   Specify the `DELETE` request method.

The following example shows how to use the Management API to delete a database token and revoke all
permissions associated with the token:
{{% code-placeholders "TOKEN_ID|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
 --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
 --request DELETE \
 --header "Accept: application/json" \
 --header "Authorization: Bearer $MANAGEMENT_TOKEN" \
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}: the ID of the [database token](/influxdb3/cloud-dedicated/admin/tokens/database/) to delete

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% warn %}}
#### Deleting a token is immediate and cannot be undone

Deleting a database token is a destructive action that takes place immediately
and cannot be undone.

#### Rotate deleted tokens

After deleting a database token, any clients using the deleted token need to be
updated with a new database token to continue to interact with your InfluxDB
Cloud Dedicated cluster.
{{% /warn %}}
