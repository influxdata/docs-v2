
Create API tokens using the InfluxDB user interface (UI), the `influx`
command line interface (CLI), or the InfluxDB API.

{{% note %}}

To follow best practices for secure API token generation and retrieval, InfluxDB enforces access restrictions on API tokens.

- Tokens are visible to the user who created the token.
- InfluxDB only allows access to the API token value immediately after the token is created.
- You can't change access (**read/write**) permissions for an API token after it's created.
- Tokens stop working when the user who created the token is deleted.

**We recommend the following for managing your tokens:**

- Create a generic user to create and manage tokens for writing data.
- Store your tokens in a secure password vault for future access.

{{% /note %}}

- [Manage tokens in the InfluxDB UI](#manage-tokens-in-the-influxdb-ui)
- [Create a token in the InfluxDB UI](#create-a-token-in-the-influxdb-ui)
- [Create a token using the influx CLI](#create-a-token-using-the-influx-cli)
- [Create a token using the InfluxDB API](#create-a-token-using-the-influxdb-api)

## Manage tokens in the InfluxDB UI

To manage InfluxDB API Tokens in the InfluxDB UI, navigate to the **API Tokens** management page.

{{% show-in "v2" %}}

In the navigation menu on the left, select **Data (Load Data)** > **API Tokens**.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

In the navigation menu on the left, select **Load Data** > **API Tokens**.

{{% /show-in %}}

{{< nav-icon "load-data" >}}

## Create a token in the InfluxDB UI

{{% show-in "v2" %}}

1. From the [API Tokens management page](#manage-tokens-in-the-influxdb-ui),
click **{{< icon "plus" >}} Generate** and select a token type
   (**Read/Write Token** or **All Access API Token**).
2. In the window that appears, enter a description for your token in the **Description** field.
3. If generating a **read/write token**:
    - Search for and select buckets to read from in the **Read** pane.
    - Search for and select buckets to write to in the **Write** pane.
4. Click **Save**.

{{% /show-in %}}


{{% show-in "cloud,cloud-serverless" %}}

### Create an All Access token

1. From the [API Tokens management page](#manage-tokens-in-the-influxdb-ui),
click the **{{< icon "plus" >}} {{< caps >}}Generate API Token{{< /caps >}}** button.
2. Select **All Access API Token**.

### Create a custom token

1. From the [API Tokens management page](#manage-tokens-in-the-influxdb-ui),
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

1. From the [API Tokens management page](#manage-tokens-in-the-influxdb-ui),
find the token you want to clone and click the **{{< icon "settings" >}}** icon located far right of the token description.
3. Select **Clone**.
3. When InfluxDB UI displays the created token, click **{{< caps >}}Copy to Clipboard{{< /caps >}}**. This is your only chance to access and copy the token value from InfluxDB.
4. (Optional) Store the API token value in a secure password vault.

{{% /show-in %}}

## Create a token using the influx CLI

Use the [`influx auth create` command](/influxdb/version/reference/cli/influx/auth/create) to create a token.
Include flags with the command to grant specific permissions to the token.
See the [available flags](/influxdb/version/reference/cli/influx/auth/create#flags).
Only tokens with the `write: authorizations` permission can create tokens.

```sh
# Syntax
influx auth create -o <org-name> [permission-flags]
```

### Examples
#### Create an All Access token

Create an All Access token to grant permissions to all resources in an organization.

```sh
influx auth create \
  --org my-org \
  --all-access
```

{{% show-in "v2" %}}

#### Create an operator token

Create an operator token to grant permissions to all resources in all organizations.

```sh
influx auth create \
  --org my-org \
  --operator
```

{{% note %}}
To [view or create an operator token](/influxdb/version/admin/tokens/create-token/) with the InfluxDB UI, `api/v2` API, or `influx` CLI after the setup process is completed, you must use an existing operator token.

To create a new operator token without using an existing one, see how to use the [`influxd recovery auth`](/influxdb/version/reference/cli/influxd/recovery/auth/) CLI.
{{% /note %}}
{{% /show-in %}}

#### Create a token with specified permissions

##### Create a token with specified read permissions

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

##### Create a token scoped to a user and with specified read and write permissions

```sh
influx auth create       \
  --org ORG_NAME         \
  --user USERNAME        \
  --read-authorizations  \
  --write-authorizations \
  --read-buckets         \
  --write-buckets        \
  --read-dashboards      \
  --write-dashboards     \
  --read-tasks           \
  --write-tasks          \
  --read-telegrafs       \
  --write-telegrafs      \
  --read-users           \
  --write-users
```

See the [`influx auth create` documentation](/influxdb/version/reference/cli/influx/auth/create) for information about other available flags.

## Create a token using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to create a token.

{{< api-endpoint method="POST" endpoint="http://localhost:8086/api/v2/authorizations" api-ref="/influxdb/version/api/#operation/PostAuthorizations" >}}

Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| API token with the [`write: authorizations`](/influxdb/version/api/#operation/PostAuthorizations) permission  | Use the `Authorization` header and the {{% show-in "v2" %}}`Bearer` or {{% /show-in %}}`Token` scheme. |
| Organization         | Pass as `orgID` in the request body.
| Permissions list     | Pass as a `permissions` array in the request body.

```sh
{{% get-shared-text "api/v2.0/auth/oss/token-create.sh" %}}
```

### Create a token scoped to a user

To scope a token to a user other than the token creator, pass the `userID` property in the request
body.

```sh
{{% get-shared-text "api/v2.0/auth/oss/tokens-create-with-user.sh" %}}
```

See the
[`POST /api/v2/authorizations` documentation](/influxdb/version/api/#operation/PostAuthorizations)
for more information about options.
