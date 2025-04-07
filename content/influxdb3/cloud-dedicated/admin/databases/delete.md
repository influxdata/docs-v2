---
title: Delete a database
description: >
  Use the [`influxctl database delete` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/delete/)
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

Use the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/)
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
to delete a database from your {{< product-name omit=" Clustered" >}} cluster.

> [!Warning]
> 
> #### Deleting a database cannot be undone
> 
> Once a database is deleted, data stored in that database cannot be recovered.
>
> #### Wait before writing to a new database with the same name
>
> After deleting a database from your {{% product-name omit=" Clustered" %}}
> cluster, you can reuse the name to create a new database, but **wait two to
> three minutes** after deleting the previous database before writing to the new
> database to allow write caches to clear.

{{< tabs-wrapper >}}
{{% tabs %}}
[influxctl](#)
[Management API](#)
{{% /tabs %}}
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
