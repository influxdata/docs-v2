---
title: Create a resource token
description: >
  Use the [`influxdb3 create token --permission` command](/influxdb3/enterprise/reference/cli/influxdb3/create/token/)
  or the [HTTP API](/influxdb3/enterprise/api/v3/)
  to create fine-grained permissions tokens that grant access to resources such as databases and system information.
  Database tokens allow for reading and writing data in your {{< product-name omit="Clustered" >}} instance.
  System tokens allow for reading system information and metrics for your server.
menu:
  influxdb3_enterprise:
    parent: Resource tokens
weight: 201
list_code_example: |
  ##### CLI
  ```bash
  influxdb3 create token \
    --permission "db:DATABASE1,DATABASE2:read,write" \
    --name "Read-write on DATABASE1, DATABASE2" \
    --token ADMIN_TOKEN \
    --expiry 1y
  ```

  ##### HTTP API
  ```bash
  curl \
  "http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" \
    --header 'Accept: application/json' \
    --header 'Content-Type: application/json' \
    --header "Authorization: Bearer AUTH_TOKEN" \
    --data '{
      "token_name": "Read-write for DATABASE1, DATABASE2",
      "permissions": [{
        "resource_type": "db",
        "resource_identifier": ["DATABASE1","DATABASE2"],
        "actions": ["read","write"]
       }],
       "expiry_secs": 300000
    }'
  ```
alt_links:
  cloud-dedicated: /influxdb3/enterprise/admin/tokens/create-token/
  cloud-serverless: /influxdb3/cloud-serverless/admin/tokens/create-token/
---

Use the [`influxdb3 create token --permission` command](/influxdb3/enterprise/reference/cli/influxdb3/create/token/permission/)
or the [`/api/v3/configure/token` HTTP API endpoint](/influxdb3/enterprise/api/v3/#operation/PostCreateResourceToken)
to create fine-grained permissions tokens that grant access to resources such as databases and system information.
Database tokens allow for reading and writing data in your {{< product-name omit="Clustered" >}} instance.
System tokens allow for reading system information and metrics for your server.

After you
[create an _admin token_](/influxdb3/enterprise/admin/tokens/admin/create/), you
can use the token string to authenticate `influxdb3` commands and HTTP API requests
for managing database and system tokens.

_The HTTP API examples in this guide use [cURL](https://curl.se/) to send an API request, but you can use any HTTP client._

> [!Note]
> #### Store secure tokens in a secret store
> 
> Token strings are returned _only_ on token creation.
> Store database tokens in a **secure secret store**.
> If you lose a resource token string, revoke the token and create a new one.

## Create a database token

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[HTTP API](#)
{{% /tabs %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXDB3 ----------------------------->

Use the [`influxdb3 create token --permission` command](/influxdb3/enterprise/reference/cli/influxdb3/create/token/permission/)
to create a database token with fine-grained permissions for reading and writing data in
your {{% product-name %}} instance.

In your terminal, enter `influxdb3 create token` and provide the following:

- `--permission`: Token permissions (read, write) in the `RESOURCE_TYPE:RESOURCE_NAMES:ACTIONS` format--for example:

  ```
  db:DATABASE1,DATABASE2:read,write
  ```

  - `db:`: The `db` resource type, which specifies the token is for a database
  - `DATABASE1,DATABASE2`: A comma-separated list of database names to grant permissions to.
    The resource names part supports the `*` wildcard, which grants read or write permissions to all databases.
  - `read,write`: A comma-separated list of permissions to grant to the token.
- `--name`: A unique name for the token
- _Options_, for example:
  -  `--expiry`: The token expiration time as a duration.
      If an expiration isn't set, the token does not expire until revoked.
{{% code-placeholders "Read-write on DATABASE1, DATABASE2|DATABASE1,DATABASE2|1y|read,write" %}}
```bash
influxdb3 create token \
  --permission "db:DATABASE1,DATABASE2:read,write" \
  --name "Read-write on DATABASE1, DATABASE2" \
  --expiry 1y
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE1`{{% /code-placeholder-key %}}, {{% code-placeholder-key %}}`DATABASE2`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb3/enterprise/admin/databases/)
- {{% code-placeholder-key %}}`1y`{{% /code-placeholder-key %}}:
  the token expiration time as a duration

The output is the token string in plain text.

<!-------------------------------- END INFLUXDB3 ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->

Send a request to the following {{% product-name %}} endpoint:

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" method="post" %}}

Provide the following request headers:

- `Accept: application/json` to ensure the response body is JSON content
- `Content-Type: application/json` to indicate the request body is JSON content
- `Authorization: Bearer` and the [admin token](/influxdb3/enterprise/admin/tokens/admin/)
  for your instance to authorize the request

In the request body, provide the following parameters:

- `token_name`: a description of the token, unique within the instance
- `resource_type`: the resource type for the token, which is always `db`
- `resource_identifier`: an array of database names to grant permissions to
  - The resource identifier field supports the `*` wildcard, which grants read or write
    permissions to all databases.
- `permissions`: an array of token permission actions (`"read"`, `"write"`) for the database
- `expiry_secs`: Specify the token expiration time in seconds.

The following example shows how to use the HTTP API to create a database token:

{{% code-placeholders "DATABASE1|DATABASE2|300000" %}}

```bash
  curl \
  "http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{
    "token_name": "Read-write for DATABASE1, DATABASE2",
    "permissions": [{
      "resource_type": "db",
      "resource_identifier": ["DATABASE1","DATABASE2"],
      "actions": ["read","write"]
     }],
     "expiry_secs": 300000
  }'
```
{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`DATABASE1`{{% /code-placeholder-key %}}, {{% code-placeholder-key %}}`DATABASE2`{{% /code-placeholder-key %}}:
  your {{% product-name %}} [database](/influxdb3/enterprise/admin/databases/)
- {{% code-placeholder-key %}}`300000`{{% /code-placeholder-key %}}:
  the token expiration time in seconds

The response body contains token details, including the `token` field with the
token string in plain text.

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Examples

- [Create a token with read and write access to a database](#create-a-token-with-read-and-write-access-to-a-database)
- [Create a token with read and write access to all databases](#create-a-token-with-read-and-write-access-to-all-databases)
- [Create a token with read-only access to a database](#create-a-token-with-read-only-access-to-a-database)
- [Create a token with read-only access to multiple databases](#create-a-token-with-read-only-access-to-multiple-databases)
- [Create a token that expires in seven days](#create-a-token-that-expires-in-seven-days)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} [database](/influxdb3/enterprise/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE2_NAME`{{% /code-placeholder-key %}}: your {{< product-name >}} [database](/influxdb3/enterprise/admin/databases/)
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: the {{% token-link "" "admin" %}} for your {{% product-name %}} instance 

#### Create a token with read and write access to a database

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
influxdb3 create token \
  --permission "db:DATABASE_NAME:read,write" \
  --name "Read/write token for DATABASE_NAME"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl \
  "http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "token_name": "Read/write token for DATABASE_NAME",
    "permissions": [{
      "resource_type": "db",
      "resource_identifier": ["DATABASE_NAME"],
      "actions": ["read","write"]
    }]
  }'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

#### Create a token with read and write access to all databases

{{% code-placeholders "AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
influxdb3 create token \
  --permission "db:*:read,write" \
  --name "Read/write token for all databases"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl \
  "http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "token_name": "Read/write token for all databases",
    "permissions": [{
      "resource_type": "db",
      "resource_identifier": ["*"],
      "actions": ["read","write"]
    }]
  }'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

#### Create a token with read-only access to a database

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
influxdb3 create token \
  --permission "db:DATABASE_NAME:read" \
  --name "Read-only token for DATABASE_NAME"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl \
  "http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "token_name": "Read-only token for DATABASE_NAME",
    "permissions": [{
      "resource_type": "db",
      "resource_identifier": ["DATABASE_NAME"],
      "actions": ["read"]
    }]
  }'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

#### Create a token with read-only access to multiple databases

{{% code-placeholders "DATABASE_NAME|DATABASE2_NAME|AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
influxdb3 create token \
  --permission "db:DATABASE_NAME,DATABASE2_NAME:read" \
  --name "Read-only token for DATABASE_NAME, DATABASE2_NAME"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl \
  "http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "token_name": "Read-only token for DATABASE_NAME, DATABASE2_NAME",
    "permissions": [{
      "resource_type": "db",
      "resource_identifier": ["DATABASE_NAME","DATABASE2_NAME"],
      "actions": ["read"]
    }]
  }'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

#### Create a token that expires in seven days

{{% code-placeholders "DATABASE_NAME|7d|604800|AUTH_TOKEN" %}}
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#)
[HTTP API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
influxdb3 create token \
  --permission "db:DATABASE_NAME:read,write" \
  --name "Read/write token for DATABASE_NAME with 7d expiration" \
  --expiry 7d
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl \
  "http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "token_name": "Read/write token for DATABASE_NAME with 7d expiration",
    "permissions": [{
      "resource_type": "db",
      "resource_identifier": ["DATABASE_NAME"],
      "actions": ["read","write"]
    }],
    "expiry_secs": 604800
  }'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
{{% /code-placeholders %}}

## Create a system token

System tokens have the `system` resource type and allow for read-only access
to system information and metrics from your server.

You can create system tokens for the following system resources:

- `health`: system health information from the `/health` HTTP API endpoint
- `metrics`: system metrics information from the `/metrics` HTTP API endpoint
- `ping`: system ping information from the `/ping` HTTP API endpoint

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[HTTP API](#)
{{% /tabs %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXDB3 ----------------------------->

Use the [`influxdb3 create token` command](/influxdb3/enterprise/reference/cli/influxdb3/create/token/)
to create a system token with permissions for reading system information from
your {{% product-name %}} instance.

In your terminal, run the `influxdb3 create token --permission` command and provide the following:

  - `--name`: A unique name for the token
  - _Options_, for example:
    -  `--expiry`: The token expiration time as a duration.
     If an expiration isn't set, the token does not expire until revoked.
  - Token permissions in the `RESOURCE_TYPE:RESOURCE_NAMES:ACTIONS` format--for example:

    ```
    system:health:read
    ``` 

    - `system:`: The `system` resource type, which specifies the token is for system information.
    - `health`: The specific system resource to grant permissions to.
    - `read`: The permission to grant to the token (system tokens are always read-only).

{{% code-placeholders "System health token|1y" %}}
```bash
influxdb3 create token \
  --permission "system:health:read" \
  --name "System health token" \
  --expiry 1y
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`1y`{{% /code-placeholder-key %}}:
  the token expiration time as a
  duration.

The output is the token string in plain text.

<!-------------------------------- END INFLUXDB3 ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->
Send a request to the following {{% product-name %}} endpoint:

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" method="post" %}}

Provide the following request headers:

- `Accept: application/json` to ensure the response body is JSON content
- `Content-Type: application/json` to indicate the request body is JSON content
- `Authorization: Bearer` and the [admin token](/influxdb3/enterprise/admin/tokens/admin/)
  for your instance to authorize the request

In the request body, provide the following parameters:

- `token_name`: a description of the token, unique within the instance
- `resource_type`: the resource type for the token, which is `system` for system tokens
- `resource_identifier`: an array of system resource names to grant permissions to
  - The resource identifier field supports the `*` wildcard, which grants read or write
    permissions to all system information resources.
- `permissions`: an array of token permission actions (only `"read"` for system tokens)
- `expiry_secs`: Specify the token expiration time in seconds.

The following example shows how to use the HTTP API to create a system token:

{{% code-placeholders "AUTH_TOKEN|System health token|300000" %}}

```bash
curl \
"http://{{< influxdb/host >}}/api/v3/enterprise/configure/token" \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer AUTH_TOKEN" \
--data '{
  "token_name": "System health token",
  "permissions": [{
  "resource_type": "system",
  "resource_identifier": ["health"],
  "actions": ["read"]
   }],
   "expiry_secs": 300000
}'
```
{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`300000`{{% /code-placeholder-key %}}:
  the token expiration time in seconds.

The response body contains token details, including the `token` field with the
token string in plain text.

<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Output format

The `influxdb3 create token` command supports the `--format json` option.
By default, the command outputs the token string.
For easier programmatic access to the command output, include `--format json`
with your command to format the output as JSON.

The `/api/v3/configure/token` endpoint outputs JSON format in the response body.
