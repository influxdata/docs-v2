---
title: Create a token
seotitle: Create an API token in InfluxDB
description: Create an API token in InfluxDB using the InfluxDB UI, the `influx` CLI, or the InfluxDB API.
menu:
  influxdb3_cloud_serverless:
    name: Create a token
    parent: Manage tokens
weight: 201
alt_links:
  cloud: /influxdb/cloud/admin/tokens/create-token/
---

Create API tokens using the InfluxDB user interface (UI), the `influx`
command line interface (CLI), or the InfluxDB API.

> [!Note]
> To follow best practices for secure API token generation and retrieval, InfluxDB enforces access restrictions on API tokens.
> 
> - Tokens are visible to the user who created the token.
> - InfluxDB only allows access to the API token value immediately after the token is created.
> - You can't change access (**read/write**) permissions for an API token after it's created.
> - Tokens stop working when the user who created the token is deleted.
> 
> **We recommend the following for managing your tokens:**
> 
> - Create a generic user to create and manage tokens for writing data.
> - Store your tokens in a secure password vault for future access.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

<!---------------------------------- BEGIN UI --------------------------------->
{{% tab-content %}}

## Create a token in the InfluxDB UI

To create an InfluxDB API token in the InfluxDB UI, navigate to the **API Tokens** management page.
In the navigation menu on the left, select **Load Data** > **API Tokens**.

{{< nav-icon "load-data" >}}

- [Create an all-access token](#create-an-all-access-token)
- [Create a custom token](#create-a-custom-token)
- [Clone a token](#clone-a-token)

### Create an all-access token

1. From the [API Tokens management page](#create-a-token-in-the-influxdb-ui),
click the **{{< icon "plus" >}} {{< caps >}}Generate API Token{{< /caps >}}** button.
2. Select **All Access API Token**.

### Create a custom token

1. From the [API Tokens management page](#create-a-token-in-the-influxdb-ui),
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

1. From the [API Tokens management page](#create-a-token-in-the-influxdb-ui),
find the token you want to clone and click the **{{< icon "settings" >}}** icon located far right of the token description.
3. Select **Clone**.
3. When InfluxDB UI displays the created token, click **{{< caps >}}Copy to Clipboard{{< /caps >}}**. This is your only chance to access and copy the token value from InfluxDB.
4. (Optional) Store the API token value in a secure password vault.

{{% /tab-content %}}
<!----------------------------------- END UI ---------------------------------->

<!--------------------------------- BEGIN CLI --------------------------------->
{{% tab-content %}}

## Create a token using the influx CLI

Use the [`influx auth create` command](/influxdb3/cloud-serverless/reference/cli/influx/auth/create) to create a token.
Include flags with the command to grant specific permissions to the token.
See the [available flags](/influxdb3/cloud-serverless/reference/cli/influx/auth/create#flags).
Only tokens with the `write: authorizations` permission can create tokens.

Provide the following flags with the command:

- `--token`: API token with permission to create new tokens
- `--org`: Organization name
- [Permission flags](/influxdb3/cloud-serverless/reference/cli/influx/auth/create#flags)

{{% code-placeholders "(API|ORG)_(TOKEN|NAME)" %}}
```sh
influx auth create \
  --token API_TOKEN \
  --org ORG_NAME \
  --read-buckets \
  --write-buckets \
  --read-dbrps \
  --write-dbrps
```
{{% /code-placeholders %}}

### Examples

- [Create an all-access token](#create-an-all-access-token-cli)
- [Create a token with specific permissions](#create-a-token-with-specific-permissions)
  - [Create a token with specified read permissions](#create-a-token-with-specified-read-permissions)
  - [Create a token scoped to a user and with specified read and write permissions](#create-a-token-scoped-to-a-user-and-with-specified-read-and-write-permissions)

#### Create an all-access token {#create-an-all-access-token-cli}

Create an All-Access token to grant permissions to all resources in an organization.

{{% code-placeholders "(API|ORG)_(TOKEN|NAME)" %}}
```sh
influx auth create \
  --token API_TOKEN \
  --org ORG_NAME \
  --all-access
```
{{% /code-placeholders %}}

#### Create a token with specific permissions

##### Create a token with specified read permissions

{{% code-placeholders "(API|ORG|BUCKET)_(TOKEN|NAME|ID)" %}}
```sh
influx auth create \
  --token API_TOKEN \
  --org ORG_NAME \
  --read-bucket BUCKET_ID \
  --read-bucket BUCKET_ID \
  --read-dashboards \
  --read-tasks \
  --read-telegrafs \
  --read-user
```
{{% /code-placeholders %}}

##### Create a token scoped to a user and with specified read and write permissions

{{% code-placeholders "(API|ORG)_(TOKEN|NAME)|USERNAME" %}}
```sh
influx auth create \
  --token API_TOKEN \
  --org ORG_NAME \
  --user USERNAME \
  --read-authorizations \
  --write-authorizations \
  --read-buckets \
  --write-buckets \
  --read-dashboards \
  --write-dashboards \
  --read-tasks \
  --write-tasks \
  --read-telegrafs \
  --write-telegrafs \
  --read-users \
  --write-users
```
{{% /code-placeholders %}}

See the [`influx auth create` documentation](/influxdb/v2/reference/cli/influx/auth/create)
for information about other available flags.

{{% /tab-content %}}
<!---------------------------------- END CLI ---------------------------------->

<!--------------------------------- BEGIN API --------------------------------->
{{% tab-content %}}

## Create a token using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to create a token.

{{< api-endpoint method="POST" endpoint="http://localhost:8086/api/v2/authorizations" api-ref="/influxdb/v2/api/#operation/PostAuthorizations" >}}

Include the following in your request:

- **Headers**
  - **Authorization**: `Token API_TOKEN`
    (API token with the [`write: authorizations`](/influxdb3/cloud-serverless/api/#operation/PostAuthorizations) permission)
  - **Content-type**: `application/json`
- **Request body**: JSON object with the following properties:
  - **status**: Token status (active or inactive)
  - **description**: Token description
  - **orgID**: Organization ID
  - **permissions**: JSON array of objects, each with the following properties:
    - **action**: Authorized action (read or write)
    - **resource**: JSON object with the following properties
      - **orgID**: Organization ID
      - **type**: Resource type
      - **name**: _(Optional)_ Resource name to scope permission to

{{% code-placeholders "(API|ORG|AUTHORIZATION)_(TOKEN|ID|DESCRIPTION)" %}}
```sh
{{% get-shared-text "api/cloud-serverless/auth/token-create.sh" %}}
```
{{% /code-placeholders %}}

### Create a token scoped to a user

To scope a token to a user other than the token creator, pass the `userID` property in the request
body.

{{% code-placeholders "(API|ORG)_(TOKEN|ID)" %}}
```sh
{{% get-shared-text "api/cloud-serverless/auth/tokens-create-with-user.sh" %}}
```
{{% /code-placeholders %}}

See the
[`POST /api/v2/authorizations` documentation](/influxdb/v2/api/#operation/PostAuthorizations)
for more information about options.

{{% /tab-content %}}
<!---------------------------------- END API ---------------------------------->
{{< /tabs-wrapper >}}
