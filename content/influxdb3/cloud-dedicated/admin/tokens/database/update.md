---
title: Update a database token
description: >
  Use the Admin UI, the [`influxctl token update` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/update/),
    or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  to update a database token's permissions in your {{< product-name omit=" Clustered" >}} cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: Database tokens
weight: 201
list_code_example: |
  ##### CLI
  ```sh
  influxctl token update \
    --read-database <DATABASE_NAME> \
    --read-database <DATABASE2_NAME> \
    --write-database <DATABASE2_NAME> \
    <TOKEN_ID>
  ```

  ##### API
  ```sh
  curl \
      --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
      --request PATCH \
      --header "Accept: application/json" \
      --header 'Content-Type: application/json' \
      --header "Authorization: Bearer MANAGEMENT_TOKEN" \
      --data '{
        "permissions": [
          {
            "action": "read",
            "resource": "DATABASE_NAME"
          },
          {
            "action": "read",
            "resource": "DATABASE2_NAME"
          },
          {
            "action": "write",
            "resource": "DATABASE2_NAME"
          }
        ]
      }'
  ```
aliases:
  - /influxdb3/cloud-dedicated/admin/tokens/update/
alt_links:
  cloud-serverless: /influxdb3/cloud-serverless/admin/tokens/update-tokens/
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/token/update/
  - /influxdb3/cloud-dedicated/reference/api/
---

Use the Admin UI, the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/),
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
to update a database token's permissions {{< product-name omit=" Clustered" >}} cluster.

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

Through this portal, administrators can edit a token's permissions to:

- Add read and write permissions for specific databases
- Edit a token's existing read and write permissions for a database

### Open the Edit Database Token dialog

{{< admin-ui-access >}}

The Database Tokens portal displays the [list of database tokens](/influxdb3/cloud-dedicated/admin/tokens/database/list/) associated with the cluster.
Use the sort and filter options above the list to find a specific token.

1.  Click the **Options** button (three vertical dots) to the right of the token you want to edit.

    {{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-database-token-options-menu.png" alt="Database token option menu" />}}

2.  Click **Edit Token** in the dropdown menu. The **Edit Database Token** dialog displays.

    {{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-edit-database-token.png" alt="Edit Database Token dialog" />}}

3.  In the **Edit Database Token** dialog, you can edit the token's **Description** and permissions.

### Edit token permissions

1. [Open the Edit Database Token dialog](#open-the-edit-database-token-dialog) for the database token.
   
   The **Edit Database Token** dialog displays the token's existing permissions.
   Each permission consists of:

   - A database (specific database name or **All Databases**)
   - Action permissions (Read and Write)

2. To change which database a permission applies to, click the **Database** dropdown and select a different database or **All Databases**.
3. To adjust the access level of the permission, use the **Read** and **Write** buttons under **Actions** to toggle these permissions on or off for the selected database.

### Add token permissions

1. [Open the Edit Database Token dialog](#open-the-edit-database-token-dialog) for the database token.
2. In the dialog, click **Add Permission**.
3. For the new permission, select a database from the dropdown.
4. Toggle the **Read** and **Write** buttons to set the access level.
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL ----------------------------->
Use the [`influxctl token update` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/update/)
to update a database token's permissions in your {{< product-name omit=" Clustered" >}} cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure an `influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.
2.  To list token IDs, run the [`influxctl token list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/list) in your terminal.

     ```sh
    influxctl token list
    ```

    Copy the **token ID** of the token you want to update.
3.  In your terminal, run the `influxctl token update` command and provide the following:

    - Token permissions (read and write)
      - `--read-database`: Grants read permissions to the specified database. Repeatable.
      - `--write-database`: Grants write permissions to the specified database. Repeatable.

      Both of these flags support the `*` wildcard which grants read or write
      permissions to all databases. Enclose wildcards in single or double
      quotes--for example: `'*'` or `"*"`.

    - the token ID

{{% code-placeholders "DATABASE_NAME|TOKEN_ID" %}}

```sh
influxctl token update \
  --description "my updated test token" \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  TOKEN_ID
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/)- {{% code-placeholder-key %}}`TOKEN ID`{{% /code-placeholder-key %}}: ID of the token to update

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->

_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

   {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" method="patch" api-ref="/influxdb3/cloud-dedicated/api/management/#patch-/accounts/-accountId-/clusters/-clusterId-/tokens/-tokenId-" %}}

   In the URL, provide the following:

   - `ACCOUNT_ID`: The ID of the [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that the cluster belongs to _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `CLUSTER_ID`: The ID of the [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that you want to manage _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `TOKEN_ID`: The ID of the database [token](/influxdb3/cloud-dedicated/admin/tokens/database) that you want to update _(see how to [list token details](/influxdb3/cloud-dedicated/admin/tokens/database/list/#detailed-output-in-json))_.

   Provide the following request headers:

   - `Accept: application/json` to ensure the response body is JSON content
   - `Content-Type: application/json` to indicate the request body is JSON content
   - `Authorization: Bearer` and a [Management API token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your cluster _(see how to [create a management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

   In the request body, provide the following parameters:

    - `permissions`: an array of token [permissions](/influxdb3/cloud-dedicated/api/management/#post-/accounts/-accountId-/clusters/-clusterId-/tokens) (read or write) objects:
      - `"action"`: Specify `read` or `write` permission to the database.
      - `"resource"`: Specify the database name.
    - `description`: Provide a description of the token.

The following example shows how to use the Management API to update a token's permissions:

{{% code-placeholders "DATABASE_NAME|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
   --request PATCH \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
             "description": "my updated test token",
              "permissions": [
                {
                  "action": "read",
                  "resource": "DATABASE_NAME"
                },
                {
                  "action": "write",
                  "resource": "DATABASE_NAME"
                }
              ]
           }'
```

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: a {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/) that the token will have read or write permission to

{{% /code-placeholders %}}
<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

> [!Note]
> 
> #### Existing permissions are replaced on update
> 
> When updating token permissions, the existing permissions are replaced by the
> new permissions specified in the update command.
> To retain existing permissions, include them in the update command.

### Examples

- [Update a token with read and write access to a database](#update-a-token-with-read-and-write-access-to-a-database)
- [Update a token with read and write access to all databases](#update-a-token-with-read-and-write-access-to-all-databases)
- [Update a token with read-only access to a database](#update-a-token-with-read-only-access-to-a-database)
- [Update a token with read-only access to multiple databases](#update-a-token-with-read-only-access-to-multiple-databases)
- [Update a token with mixed permissions to multiple databases](#update-a-token-with-mixed-permissions-to-multiple-databases)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} database
- {{% code-placeholder-key %}}`DATABASE2_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} database
- {{% code-placeholder-key %}}`TOKEN ID`{{% /code-placeholder-key %}}: ID of the token to update
- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster

#### Update a token for read and write access to a database

{{% code-placeholders "DATABASE_NAME|TOKEN_ID|MANAGEMENT_TOKEN|ACCOUNT_ID|CLUSTER_ID" %}}
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
influxctl token update \
  --description "Read/write to DATABASE_NAME" \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  TOKEN_ID
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
   --request PATCH \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "description": "Read/write to DATABASE_NAME",
     "permissions": [
       {
         "action": "read",
         "resource": "DATABASE_NAME"
       },
       {
         "action": "write",
         "resource": "DATABASE_NAME"
       }
      ]
   }'
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

#### Update a token with read and write access to all databases

{{% code-placeholders "TOKEN_ID|MANAGEMENT_TOKEN|ACCOUNT_ID|CLUSTER_ID" %}}
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
influxctl token update \
  --read-database "*" \
  --write-database "*" \
  TOKEN_ID
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
   --request PATCH \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "permissions": [
       {
         "action": "read",
         "resource": "*"
       },
       {
         "action": "write",
         "resource": "*"
       }
      ]
   }'
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}
{{% /code-placeholders %}}

#### Update a token for read-only access to a database

{{% code-placeholders "DATABASE_NAME|TOKEN_ID|MANAGEMENT_TOKEN|ACCOUNT_ID|CLUSTER_ID" %}}
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
influxctl token update \
  --read-database DATABASE_NAME \
  TOKEN_ID
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
   --request PATCH \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "description": "Read-only token for DATABASE_NAME",
     "permissions": [
       {
         "action": "read",
         "resource": "DATABASE_NAME"
       }
     ]
     }'
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

#### Update a token to provide read-only access to multiple databases

{{% code-placeholders "DATABASE2_NAME|DATABASE_NAME|TOKEN_ID|MANAGEMENT_TOKEN|ACCOUNT_ID|CLUSTER_ID" %}}
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
influxctl token update \
  --description "Read-only token for DATABASE_NAME and DATABASE2_NAME" \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  TOKEN_ID
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
   --request PATCH \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "description": "Read-only token for DATABASE_NAME and DATABASE2_NAME",
     "permissions": [
       {
         "action": "read",
         "resource": "DATABASE_NAME"
       },
       {
         "action": "read",
         "resource": "DATABASE2_NAME"
       }
     ]
    }'
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

#### Update a token to provide mixed permissions to multiple databases

{{% code-placeholders "DATABASE2_NAME|DATABASE_NAME|TOKEN_ID|MANAGEMENT_TOKEN|ACCOUNT_ID|CLUSTER_ID" %}}
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
influxctl token update \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  --write-database DATABASE2_NAME \
  TOKEN_ID
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens/TOKEN_ID" \
   --request PATCH \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "description": "Read-only on DATABASE_NAME, read/write on DATABASE2_NAME",
     "permissions": [
       {
         "action": "read",
         "resource": "DATABASE_NAME"
       },
       {
         "action": "read",
         "resource": "DATABASE2_NAME"
       },
       {
         "action": "write",
         "resource": "DATABASE2_NAME"
       },
     ]
   }'
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}
