---
title: Create a database token
description: >
  Use the Admin UI, the [`influxctl token create` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/create/),
  or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  to create a [database token](/influxdb3/cloud-dedicated/admin/tokens/database/) for reading and writing data in your InfluxDB Cloud Dedicated cluster.
  Provide a token description and permissions for databases.
menu:
  influxdb3_cloud_dedicated:
    parent: Database tokens
weight: 201
list_code_example: |
  ##### CLI
  ```sh
  influxctl token create \
    --read-database DATABASE1_NAME \
    --read-database DATABASE2_NAME \
    --write-database DATABASE2_NAME \
    --expires-at 2030-01-01T00:00:00Z \
    "Read-only on DATABASE1_NAME, Read/write on DATABASE2_NAME"
  ```

  ##### API
  ```sh
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
    --header "Accept: application/json" \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer MANAGEMENT_TOKEN" \
    --data '{
      "description": "Read/write token for DATABASE_NAME",
      "permissions": [
        {
          "action": "write",
          "resource": "DATABASE_NAME"
        },
        {
          "action": "read",
          "resource": "DATABASE_NAME"
        }
      ],
      "expirationType": "datetime",
      "expiresAt": "2030-01-01T00:00:00Z"
    }'
  ```
aliases:
  - /influxdb3/cloud-dedicated/admin/tokens/create/
alt_links:
  cloud-serverless: /influxdb3/cloud-serverless/admin/tokens/create-token/
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/token/create/
  - /influxdb3/cloud-dedicated/reference/api/
---

Use the Admin UI, the [`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/),
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/) to create a [database token](/influxdb3/cloud-dedicated/admin/tokens/database/) with permissions for reading and writing data in your {{< product-name omit=" Clustered" >}} cluster.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN ADMIN UI ------------------------------->

The InfluxDB Cloud Dedicated administrative UI includes a portal for creating and managing database tokens.

1.  To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

    <pre>
    <a href="https://{{< influxdb/host >}}/">https://{{< influxdb/host >}}</a>
    </pre>

2.  Use the credentials provided by InfluxData to log into the Admin UI.
    If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).
3.  After you log in, the Account Management portal displays [account information](/influxdb3/cloud-dedicated/admin/account/)
    and the list of clusters associated with your account.
4. Find the cluster that you want to create a database token for. You can **Search** clusters by name or ID to filter the list and use the sort button and column headers to sort the list. 
5.  Click the row for the cluster.
6.  Click the **Database Tokens** button in the upper right corner of the Cluster screen.
7.  In the Database Tokens portal, click the **New Database Token** button. 
   The **Create Database Token** dialog displays.

   {{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-create-database-token.png" alt="Create database token dialog" />}}

8. Add a token description.
   The description is used to identify the token in the list of tokens. 
9. To create a token that expires, enable the **Expiration** toggle,
    and then select the expiration date and time.
10. Set the token permissions:
    - Select the database or **All Databases** for the permission
    - Use the **Read** and **Write** buttons under **Actions** to toggle these permissions on or off for the selected database.
11. Click the **Create Token** button. The dialog displays the **Token secret** string and the description you provided.

{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN INFLUXCTL ----------------------------->

Use the [`influxctl token create` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/token/create/)
to create a token that grants access to databases in your {{% product-name omit=" Clustered" %}} cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure an `influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.
2.  In your terminal, run the `influxctl token create` command and provide the following:

    - Token permissions (read and write)
      - `--read-database`: Grants read permissions to the specified database. Repeatable.
      - `--write-database`: Grants write permissions to the specified database. Repeatable.

      Both of these flags support the `*` wildcard which grants read or write
      permissions to all databases. Enclose wildcards in single or double
      quotes--for example: `'*'` or `"*"`.

    - _Optional_: the `--expires-at` flag with an RFC3339 date string that defines the
      token expiration date and time--for example, `{{< datetime/current-date offset=1 >}}`.
      If an expiration isn't set, the token does not expire until revoked.
      
    - Token description

{{% code-placeholders "DATABASE_NAME|TOKEN_DESCRIPTION|RFC3339_TIMESTAMP" %}}

```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  --expires-at RFC3339_TIMESTAMP \
  "Read/write token for DATABASE_NAME"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  your {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`RFC3339_TIMESTAMP`{{% /code-placeholder-key %}}:
  the token expiration date and time in
  [RFC3339 format](/influxdb3/cloud-dedicated/reference/glossary/#rfc3339-timestamp).

The output is the token ID and the token string.
**This is the only time the token string is available in plain text.**

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->
_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1.  If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2.  In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

    {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" method="post" api-ref="/influxdb3/cloud-dedicated/api/management/#operation/CreateDatabaseToken" %}}

    In the URL, provide the following credentials:

    - `ACCOUNT_ID`: The ID of the [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that the cluster belongs to _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
    - `CLUSTER_ID`: The ID of the [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that you want to manage _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.

    Provide the following request headers:

    - `Accept: application/json` to ensure the response body is JSON content
    - `Content-Type: application/json` to indicate the request body is JSON content
    - `Authorization: Bearer` and a [Management API token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your cluster _(see how to [create a management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

    In the request body, provide the following parameters:

    - `permissions`: an array of token [permissions](/influxdb3/cloud-dedicated/api/management/#operation/CreateDatabaseToken) (read or write) objects:
      - `"action"`: Specify `read` or `write` permission to the database.
      - `"resource"`: Specify the database name.
    - `description`: Provide a description of the token.
    - `expirationType`: Specify `datetime` or `noExpiration` token expiration type.
    - `expiresAt`: Specify the token expiration date and time in
      [RFC3339 format](/influxdb3/cloud-dedicated/reference/glossary/#rfc3339-timestamp).

      > [!Note]
      > `expiresAt` is only required when `expirationType` is `datetime`.

The following example shows how to use the Management API to create a database token:

{{% code-placeholders "DATABASE_NAME|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "description": "Read/write token for DATABASE_NAME",
     "permissions": [
       {
         "action": "write",
         "resource": "DATABASE_NAME"
       },
       {
         "action": "read",
         "resource": "DATABASE_NAME"
       }
     ],
      "expirationType": "datetime",
      "expiresAt": "2030-01-01T00:00:00Z"
   }'
```

{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: a {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/) that the token will have read or write permission to

The response body contains the token ID and the token string.
**This is the only time the token string is available in plain text.**
<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Notable behaviors

- InfluxDB might take some time--from a few seconds to a few minutes--to activate and synchronize new tokens.
If a new database token doesn't immediately work (you receive a `401 Unauthorized` error) for querying or writing, wait and then try again.
- Token strings are viewable _only_ on token creation.

> [!Note]
> 
> #### Store secure tokens in a secret store
> 
> Token strings are viewable _only_ on token creation and aren't stored by InfluxDB.
> We recommend storing database tokens in a **secure secret store**.
> For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/os).
> 
> If you lose a token, [delete the token from InfluxDB](/influxdb3/cloud-dedicated/admin/tokens/database/delete/) and create a new one.

## Output format

The `influxctl token create` command supports the `--format json` option.
By default, the command outputs the token string.
For [token details](/influxdb3/cloud-dedicated/api/management/#operation/CreateDatabaseToken) and easier programmatic access to the command output, include `--format json`
with your command to format the output as JSON.

The Management API outputs JSON format in the response body.

## Examples

- [Create a token with read and write access to a database](#create-a-token-with-read-and-write-access-to-a-database)
- [Create a token with read and write access to all databases](#create-a-token-with-read-and-write-access-to-all-databases)
- [Create a token with read-only access to a database](#create-a-token-with-read-only-access-to-a-database)
- [Create a token with read-only access to multiple databases](#create-a-token-with-read-only-access-to-multiple-databases)
- [Create a token with mixed permissions to multiple databases](#create-a-token-with-mixed-permissions-to-multiple-databases)
- [Create a token that expires in seven days](#create-a-token-that-expires-in-seven-days)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} [database](/influxdb3/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE2_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} [database](/influxdb3/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database token for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster

### Create a token with read and write access to a database

{{% code-placeholders "DATABASE_NAME|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}
{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  "Read/write token for DATABASE_NAME"
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "description": "Read/write token for DATABASE_NAME",
     "permissions": [
       {
         "action": "write",
         "resource": "DATABASE_NAME"
       },
       {
         "action": "read",
         "resource": "DATABASE_NAME"
       }
     ],
     "expirationType": "noExpiration"
   }'
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

### Create a token with read and write access to all databases

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
influxctl token create \
  --read-database "*" \
  --write-database "*" \
  "Read/write token for all databases"
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}
```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data '{
     "description": "Read/write token for all databases",
     "permissions": [
       {
         "action": "write",
         "resource": "*"
       },
       {
         "action": "read",
         "resource": "*"
       }
     ]
   }'
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

### Create a token with read-only access to a database

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME" %}}

```sh
influxctl token create \
  --read-database DATABASE_NAME \
  "Read-only token for DATABASE_NAME"
```

{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
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

{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Create a token with read-only access to multiple databases

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME" %}}

```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  "Read-only token for DATABASE_NAME and DATABASE2_NAME"
```

{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE2_NAME|DATABASE_NAME|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
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

{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Create a token with mixed permissions to multiple databases

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME" %}}

```sh
influxctl token create \
  --read-database DATABASE_NAME \
  --read-database DATABASE2_NAME \
  --write-database DATABASE2_NAME \
  "Read-only on DATABASE_NAME, read/write on DATABASE2_NAME"
```

{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE2_NAME|DATABASE_NAME|ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
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

{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Create a token that expires in seven days

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Linux](#)
[macOS](#)
{{% /tabs %}}
{{% tab-content %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME" %}}

<!-- pytest.mark.skip -->

```bash
influxctl token create \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  --expires-at $(date -d "+7 days" +"%Y-%m-%dT%H:%M:%S%z") \
  "Read/write token for DATABASE_NAME with 7d expiration"
```

{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data "{
     \"description\": \"Read/write token for DATABASE_NAME\",
     \"permissions\": [
       {
         \"action\": \"write\",
         \"resource\": \"DATABASE_NAME\"
       },
       {
         \"action\": \"read\",
         \"resource\": \"DATABASE_NAME\"
       }
     ],
     \"expirationType\": \"datetime\",
     \"expiresAt:\" \"$(date -d "+7 days" +"%Y-%m-%dT%H:%M:%S%z")\"
   }"
```

{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}
{{% tab-content %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxctl](#)
[Management API](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME" %}}

<!-- pytest.mark.skip -->

```bash
influxctl token create \
  --read-database DATABASE_NAME \
  --write-database DATABASE_NAME \
  --expires-at $(gdate -d "+7 days" +"%Y-%m-%dT%H:%M:%S%z") \
  "Read/write token for DATABASE_NAME with 7d expiration"
```

{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/tokens" \
   --header "Accept: application/json" \
   --header 'Content-Type: application/json' \
   --header "Authorization: Bearer MANAGEMENT_TOKEN" \
   --data "{
     \"description\": \"Read/write token for DATABASE_NAME\",
     \"permissions\": [
       {
         \"action\": \"write\",
         \"resource\": \"DATABASE_NAME\"
       },
       {
         \"action\": \"read\",
         \"resource\": \"DATABASE_NAME\"
       }
     ],
     \"expirationType\": \"datetime\",
     \"expiresAt:\" \"$(gdate -d "+7 days" +"%Y-%m-%dT%H:%M:%S%z")\"
   }"
```

{{% /code-placeholders %}}
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}
