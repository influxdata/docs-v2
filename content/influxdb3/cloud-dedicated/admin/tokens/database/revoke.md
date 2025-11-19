---
title: Revoke a database token
description: >
  Use the Admin UI, the [`influxctl token revoke` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/revoke/),
  or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  to revoke a database token associated with your {{% product-name omit=" Clustered" %}}
  cluster and remove all permissions associated with the token.
  Provide the ID of the database token you want to revoke.
menu:
  influxdb3_cloud_dedicated:
    parent: Database tokens
weight: 203
list_code_example: |
  ##### CLI
  ```sh
  influxctl token revoke <TOKEN_ID>
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
  - /influxdb3/cloud-dedicated/admin/tokens/database/delete/
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/token/revoke/
  - /influxdb3/cloud-dedicated/reference/api/
---

Use the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/)
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
to revoke a database token associated with your
{{< product-name omit=" Clustered" >}} cluster.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------BEGIN ADMIN UI ------------------------------>
The InfluxDB Cloud Dedicated administrative UI includes a portal for creating
and managing database tokens.

Administrators can use this portal to:

- View token details
- Add read and write permissions for specific databases to a token
- Edit a token's existing read and write permissions for a database
- Create a database token
- Revoke a database token

Access the InfluxDB Cloud Dedicated Admin UI at [console.influxdata.com](https://console.influxdata.com).
If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

The Database Tokens portal displays the [list of database tokens](/influxdb3/cloud-dedicated/admin/tokens/database/list/) associated with the cluster.
    Use the sort and filter options above the list to find a specific token.
7.  Click the **Options** button (three vertical dots) to the right of the token you want to revoke.
8.  In the options menu, click **Revoke Token**.
    The **Revoke Database Token** dialog displays.

    {{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-revoke-database-token.png" alt="Revoke database token dialog" />}}

9.  Check the box to confirm that you understand the risk.
10. Click the **Revoke Token** button.
    The token is revoked and filtered from the list of active tokens.
{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXCTL ----------------------------->
Use the [`influxctl token revoke` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/revoke/)
to revoke a database token and remove all permissions associated with the token.

1.  If you haven't already,
    [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then
    [configure an `influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
    for your cluster.

2.  To list token IDs, run the
    [`influxctl token list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/list)
    in your terminal.

    ```sh
    influxctl token list
    ```

    Copy the **token ID** of the token you want to revoke.

3.  Run the `influxctl token revoke` command and provide the following:

    - Token ID to revoke

4.  Confirm that you want to revoke the token.

{{% code-placeholders "TOKEN_ID" %}}

```sh
influxctl token revoke TOKEN_ID
```

{{% /code-placeholders %}}

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->

_This example uses [cURL](https://curl.se/) to send a Management HTTP API request,
but you can use any HTTP client._

1.  If you haven't already, follow the instructions to
    [install cURL](https://everything.curl.dev/install/index.html) for your system.

2.  In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

    {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" method="delete" api-ref="/influxdb3/cloud-dedicated/api/management/#operation/DeleteDatabaseToken" %}}

    In the URL, provide the following:

    - `ACCOUNT_ID`: The ID of the [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster)
      that the cluster belongs to _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
    - `CLUSTER_ID`: The ID of the [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster)
    that you want to manage _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
    - `TOKEN_ID`: The ID of the database [token](/influxdb3/cloud-dedicated/admin/tokens/database)
      that you want to revoke _(see how to [list token details](/influxdb3/cloud-dedicated/admin/tokens/database/list/#detailed-output-in-json))_.

    Provide the following request headers:

    - `Accept: application/json` to ensure the response body is JSON content
    - `Authorization: Bearer` and a [Management API token](/influxdb3/cloud-dedicated/admin/tokens/management/)
      for your cluster _(see how to [create a management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

    Specify the `DELETE` request method.

The following example shows how to use the Management API to revoke a database
token and remove all permissions associated with the token:

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

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}:
  the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster)
  associated with the token you want to revoke
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}:
  the ID of the {{% product-name omit=" Clustered" %}}
  [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster)
  associated with the token you want to revoke
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}:
  a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for
  your {{% product-name omit=" Clustered" %}} cluster
- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}: the ID of
  the [database token](/influxdb3/cloud-dedicated/admin/tokens/database/) to revoke

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

> [!Warning]
> #### Revoking a token is immediate and cannot be undone
> 
> Revoking a database token is a destructive action that takes place immediately
> and cannot be undone.
> 
> #### Rotate revoked tokens
> 
> After revoking a database token, any clients using the revoked token need to
> be updated with a new database token to continue to interact with your
> {{% product-name omit=" Clustered" %}} cluster.
