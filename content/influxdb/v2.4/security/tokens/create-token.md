---
title: Create a token
seotitle: Create an API token in InfluxDB
description: Create an API token in InfluxDB using the InfluxDB UI, the `influx` CLI, or the InfluxDB API.
aliases:
  - /influxdb/v2.4/users/tokens/create-token/
menu:
  influxdb_2_4:
    name: Create a token
    parent: Manage tokens
weight: 201
---

Create API tokens using the InfluxDB user interface (UI), the `influx`
command line interface (CLI), or the InfluxDB API.

{{% note %}}

{{% oss-only %}}Tokens are visible to the user who created the token. Users who own a token with operator permissions also have access to all tokens.
Tokens stop working when the user who created the token is deleted.

**We recommend creating a generic user to create and manage tokens for writing data.**
{{% /oss-only %}}

{{% cloud-only %}}

To follow best practices for secure API token generation and retrieval, InfluxDB Cloud enforces access restrictions on API tokens.

- Tokens are visible to the user who created the token.
- InfluxDB Cloud UI only allows access to the API token value immediately after the token is created.
- You can't change access (**read/write**) permissions for an API token after it's created.
- Tokens stop working when the user who created the token is deleted.

**We recommend the following for managing your tokens:**
- Create a generic user to create and manage tokens for writing data.
- Store your tokens in a secure password vault for future access.

{{% /cloud-only %}}
{{% /note %}}

- [Manage tokens in the InfluxDB UI](#manage-tokens-in-the-influxdb-ui)
- [Create a token in the InfluxDB UI](#create-a-token-in-the-influxdb-ui)
- [Create a token using the influx CLI](#create-a-token-using-the-influx-cli)
- [Create a token using the InfluxDB API](#create-a-token-using-the-influxdb-api)

## Manage tokens in the InfluxDB UI

To manage InfluxDB API Tokens in the InfluxDB UI, navigate to the **API Tokens** management page.

{{% oss-only %}}

In the navigation menu on the left, select **Data (Load Data)** > **Tokens**.

{{% /oss-only %}}

{{% cloud-only %}}

In the navigation menu on the left, select **Load Data** > **API Tokens**.

{{% /cloud-only %}}

{{< nav-icon "load-data" >}}

## Create a token in the InfluxDB UI

{{% oss-only %}}

1. From the [API Tokens management page](#manage-tokens-in-the-influxdb-ui),
click **{{< icon "plus" >}} Generate** and select a token type
   (**Read/Write Token** or **All Access API Token**).
2. In the window that appears, enter a description for your token in the **Description** field.
3. If generating a **read/write token**:
    - Search for and select buckets to read from in the **Read** pane.
    - Search for and select buckets to write to in the **Write** pane.
4. Click **Save**.

{{% /oss-only %}}


{{% cloud-only %}}

### Create an all-access token

1. From the [API Tokens management page](https://cloud2.influxdata.com/me/tokens),
click the **{{< icon "plus" >}} {{< caps >}}Generate API Token{{< /caps >}}** button.
2. Select **All Access API Token**.

### Create a custom token

1. From the [API Tokens management page](https://cloud2.influxdata.com/me/tokens),
click the **{{< icon "plus" >}} {{< caps >}}Generate API Token{{< /caps >}}** button.
2. Select **Custom API Token**.
3. When the **Generate a Personal API Token** window appears, enter a description. If you don't provide a description for the token, InfluxDB will generate a description from the permissions you assign.
   For example, if you select **Read** for a bucket named "\_monitoring" and **Write** for a bucket named "\_tasks", InfluxDB will generate the description "Read buckets \_monitoring Write buckets \_tasks".
4. Select the check boxes in the **Read** and **Write** columns to assign access permissions for the token. You can enable access to all buckets, individual buckets, Telegraf configurations, and other InfluxDB resources. By default, the new token has no access permissions.
5. When you're finished, click **{{< caps >}}Generate{{< /caps >}}**.
6. When InfluxDB displays the token value, click **{{< caps >}}Copy to Clipboard{{< /caps >}}**. This is your only chance to access and copy the token value from InfluxDB.
7. (Optional) Store the API token value in a secure password vault.

### Clone a token

To create a token with the same authorizations as an existing token, clone the existing token.

1. From the [API Tokens management page](https://cloud2.influxdata.com/me/tokens),
find the token you want to clone and click the **{{< icon "settings" >}}** icon located far right of the token description.
3. Select **Clone**.
3. When InfluxDB UI displays the created token, click **{{< caps >}}Copy to Clipboard{{< /caps >}}**. This is your only chance to access and copy the token value from InfluxDB.
4. (Optional) Store the API token value in a secure password vault.

{{% /cloud-only %}}

## Create a token using the influx CLI

{{% warn %}}
InfluxDB 2.4 introduced a bug that prevents you from creating an **all-access** or **operator** token using the `influx auth create` command, and causes the following error: `Error: could not write auth with provided arguments: 403 Forbidden: permission.`

Until this bug is resolved in the next influx CLI release, please use the [workaround below to create an all-access or operator token](/influxdb/v2.4/security/tokens/create-token/#workaround-to-create-an-all-access-or-operator-token).
{{% /warn %}}

### **Workaround:** To create an all-access or operator token

- Use the following command to create an [all-access](/influxdb/v2.4/security/tokens/#all-access-token) or [operator](/influxdb/v2.4/security/tokens/#operator-token) token. For an operator token, you must also include the `--read-orgs` and `--write-orgs` flags.

```sh
influx auth create
                      --org-id or --org              \
                      --read-authorizations          \
                      --write-authorizations         \
                      --read-buckets                 \
                      --write-buckets                \
                      --read-dashboards              \
                      --write-dashboards             \
                      --read-tasks                   \
                      --write-tasks                  \
                      --read-telegrafs               \
                      --write-telegrafs              \
                      --read-users                   \
                      --write-users                  \
                      --read-variables               \
                      --write-variables              \
                      --read-secrets                 \
                      --write-secrets                \
                      --read-labels                  \
                      --write-labels                 \
                      --read-views                   \
                      --write-views                  \
                      --read-documents               \
                      --write-documents              \
                      --read-notificationRules       \
                      --write-notificationRules      \
                      --read-notificationEndpoints   \
                      --write-notificationEndpoints  \
                      --read-checks                  \
                      --write-checks                 \
                      --read-dbrp                    \
                      --write-dbrp                   \
                      --read-annotations             \
                      --write-annotations            \
                      --read-sources                 \
                      --write-sources                \
                      --read-scrapers                \
                      --write-scrapers               \
                      --read-notebooks               \
                      --write-notebooks              \
                      --read-remotes                 \
                      --write-remotes                \
                      --read-replications            \
                      --write-replications
```

<!--
Use the [`influx auth create` command](/influxdb/v2.4/reference/cli/influx/auth/create) to create a token.
Include flags with the command to grant specific permissions to the token.
See the [available flags](/influxdb/v2.4/reference/cli/influx/auth/create#flags).
Only tokens with the `write: authorizations` permission can create tokens.

```sh
# Syntax
influx auth create -o <org-name> [permission-flags]
```

### Examples
#### Create an all-access token

Create an All-Access token to grant permissions to all resources in an organization.

```sh
influx auth create \
  --org my-org \
  --all-access
```

{{% oss-only %}}

#### Create an operator token

Create an operator token to grant permissions to all resources in all organizations.

```sh
influx auth create \
  --org my-org \
  --operator
```

{{% note %}}
To [view or create an operator token](/influxdb/v2.4/security/tokens/create-token/) with the InfluxDB UI, `api/v2` API, or `influx` CLI after the setup process is completed, you must use an existing operator token.

To create a new operator token without using an existing one, see how to use the [`influxd recovery auth`](/influxdb/v2.4/reference/cli/influxd/recovery/auth/) CLI.
{{% /note %}}
{{% /oss-only %}}


#### Create a token with specified read permissions

```sh
influx auth create \
  --org my-org \
  --read-bucket 03a2bbf46309a000 \
  --read-bucket 3a87c03ace269000 \
  --read-dashboards \
  --read-tasks \
  --read-telegrafs \
  --read-user
```

See the [`influx auth create` documentation](/{{< latest "influxdb" >}}/reference/cli/influx/auth/create) for information about other available flags.

## Create a token using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to create a token.

[{{< api-endpoint method="POST" endpoint="http://localhost:8086/api/v2/authorizations" >}}]((/influxdb/v2.4/api/#operation/PostAuthorizations))

Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| API token with the [`write: authorizations`](/influxdb/v2.4/api/#operation/PostAuthorizations) permission  | Use the `Authorization` header and the {{% oss-only %}}`Bearer` or {{% /oss-only %}}`Token` scheme. |
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
[`POST /api/v2/authorizations` documentation](/influxdb/v2.4/api/#operation/PostAuthorizations)
for more information about options.

##