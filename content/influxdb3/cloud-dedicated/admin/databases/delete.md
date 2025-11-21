---
title: Delete a database
description: >
  Use the Admin UI, the [`influxctl database delete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/delete/),
  or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  to delete a database from your InfluxDB Cloud Dedicated cluster.
  Provide the name of the database you want to delete.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage databases
weight: 203
list_code_example: |
  ##### CLI
  ```sh
  influxctl database delete <DATABASE_NAME>
  ```

  ##### API
  ```sh
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME" \
    --request DELETE \
    --header "Accept: application/json" \
    --header "Authorization: Bearer MANAGEMENT_TOKEN"
  ```
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/database/delete/
  - /influxdb3/cloud-dedicated/reference/api/
---

Use the Admin UI, the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/),
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
to delete a database from your {{< product-name omit=" Clustered" >}} cluster.

> [!Warning]
> #### Wait before writing to a new database with the same name
>
> After deleting a database from your {{% product-name omit=" Clustered" %}}
> cluster, you can reuse the name to create a new database, but **wait two to
> three minutes** after deleting the previous database before writing to the new
> database to allow write caches to clear.
>
> #### Tokens still grant access to databases with the same name
>
> [Database tokens](/influxdb3/cloud-dedicated/admin/tokens/database/) are associated to
> databases by name. If you create a new database with the same name, tokens
> that granted access to the deleted database will also grant access to the new
> database.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------>
The InfluxDB Cloud Dedicated administrative UI includes a portal for
managing databases.

1. To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>
2. Use the credentials provided by InfluxData to log into the Admin UI.
   If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).
3. In the database list, find the database you want to delete. You
   can sort on column headers or use the **Search** field to find a specific database.
4.  Click the options button (three vertical dots) to the right of the database you want to delete.
    The options menu displays.
5.  In the options menu, click **Delete Database**. The **Delete Database** dialog displays.
6.  In the **Delete Database** dialog, check the box to confirm that you "understand the risk of this action".
7.  In the **Enter Database Name to Delete** field, type the name of the database to confirm deletion.
8.  Click the **Delete Database** button to delete the database.

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-delete-database.png" alt="Create database dialog" />}} 
{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXCTL ----------------------------->

1.  If you haven't already,
    [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure an `influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) 
    for your cluster.

2.  In your terminal, run the `influxctl database delete` command and provide the following:

    - The name of the database to delete

3.  Confirm that you want to delete the database.

{{% code-placeholders "DATABASE_NAME" %}}

```sh
influxctl database delete DATABASE_NAME
```

{{% /code-placeholders %}}

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->

_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1.  If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2.  In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

    {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME" method="delete" api-ref="/influxdb3/cloud-dedicated/api/management/#operation/DeleteClusterDatabase" %}}

    In the URL, provide the following:

    - `ACCOUNT_ID`: The ID of the [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) 
      that the cluster belongs to _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
    - `CLUSTER_ID`: The ID of the [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) 
      that you want to manage _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
    - `DATABASE_NAME`: The name of the [database](/influxdb3/cloud-dedicated/admin/databases/)
      that you want to delete _(see how to [list databases](/influxdb3/cloud-dedicated/admin/databases/list/))_.

    Provide the following request headers:

    - `Accept: application/json` to ensure the response body is JSON content
    - `Authorization: Bearer` and a [Management API token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your cluster _(see how to [create a management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

    Specify the `DELETE` request method.

The following example shows how to use the Management API to delete a database:

{{% code-placeholders "DATABASE_NAME|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases/DATABASE_NAME" \
   --request DELETE \
   --header "Accept: application/json" \
   --header "Authorization: Bearer MANAGEMENT_TOKEN"
```

{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/)
<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}
