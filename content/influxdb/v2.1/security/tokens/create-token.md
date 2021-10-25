---
title: Create a token
seotitle: Create an API token in InfluxDB
description: Create an API token in InfluxDB using the InfluxDB UI, the `influx` CLI, or the InfluxDB API.
aliases:
  - /influxdb/v2.1/users/tokens/create-token/
menu:
  influxdb_2_1:
    name: Create a token
    parent: Manage tokens
weight: 201
---

Create API tokens using the InfluxDB user interface (UI), the `influx`
command line interface (CLI), or the InfluxDB API.

{{% note %}}
Tokens are visible only to the user who created them and stop working when the user is deactivated.
We recommend creating a generic IT user to create and manage tokens for writing data.
{{% /note %}}

## Create a token in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Tokens**.

    {{< nav-icon "disks" >}}

2. Click **{{< icon "plus" >}} Generate** and select a token type
   (**Read/Write Token** or **All-Access Token**).
3. In the window that appears, enter a description for your token in the **Description** field.
4. If generating a **read/write token**:
    - Search for and select buckets to read from in the **Read** pane.
    - Search for and select buckets to write to in the **Write** pane.
5. Click **Save**.

## Create a token using the influx CLI

Use the [`influx auth create` command](/influxdb/v2.1/reference/cli/influx/auth/create) to create a token.
Include flags with the command to grant specific permissions to the token.
See the [available flags](/influxdb/v2.1/reference/cli/influx/auth/create#flags).
Only tokens with the `write: authorizations` permission can create tokens.

```sh
# Syntax
influx auth create -o <org-name> [permission-flags]

# Example
influx auth create -o my-org \
  --read-bucket 03a2bbf46309a000 \
  --read-bucket 3a87c03ace269000 \
  --read-dashboards \
  --read-tasks \
  --read-telegrafs \
  --read-user
```

See the [`influx auth create` documentation](/influxdb/{{< latest "influxdb" >}}/reference/cli/influx/auth/create) for information about other available flags.

## Create a token using the InfluxDB API

Use the `/authorizations` endpoint of the InfluxDB API to create a token.

{{% api-endpoint method="POST" endpoint="/api/v2/authorizations" %}}

Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| API token with the [`write: authorizations`](/influxdb/v2.0/api/#operation/PostAuthorizations) permission  | Use the `Authorization` header and the {{% oss-only %}}`Bearer` or {{% /oss-only %}}`Token` scheme. |
| Organization         | Pass as `orgID` in the request body.
| Permissions list     | Pass as a `permissions` array in the request body.

```sh
{{% get-shared-text "api/v2.0/auth/oss/token-create.sh" %}}
```

### Create a token scoped to a user

To scope a token to a user other than the token creator, pass `userID` in the request
body.

```sh
{{% get-shared-text "api/v2.0/auth/oss/tokens-create-with-user.sh" %}}
```

See the
[`POST /api/v2/authorizations` documentation](/influxdb/v2.1/api/#operation/PostAuthorizations)
for more information about options.

