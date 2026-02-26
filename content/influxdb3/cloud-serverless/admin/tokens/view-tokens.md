---
title: View tokens
seotitle: View API tokens in InfluxDB
description: View API tokens in InfluxDB using the InfluxDB UI, the `influx` CLI, or the InfluxDB API.
menu:
  influxdb3_cloud_serverless:
    name: View tokens
    parent: Manage tokens
weight: 202
---

View API tokens and permissions using the InfluxDB user interface (UI),
the `influx` command line interface (CLI), or the InfluxDB API.

> [!Note]
> To follow best practices for secure API token generation and retrieval,
> {{% product-name %}} enforces access restrictions on API tokens.
>   
> - InfluxDB UI only allows access to the API token value immediately after the token is created.
> - You can't change access (**read/write**) permissions for an API token after it's created.
> - Tokens stop working when the user who created the token is deleted.
> 
> Follow these recommendations for managing tokens:
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

## View tokens in the InfluxDB UI

1.  In the navigation menu on the left, select **Load Data** > **API Tokens**.

    {{< nav-icon "load-data" >}}

2.  Click a token description in the list to view the token status and a list of
    access permissions.

{{% /tab-content %}}
<!----------------------------------- END UI ---------------------------------->

<!--------------------------------- BEGIN CLI --------------------------------->
{{% tab-content %}}

## View tokens using the influx CLI

Use the [`influx auth list` command](/influxdb3/cloud-serverless/reference/cli/influx/auth/list)
to view tokens.

Provide the following flags:

- `--token`: API token with permission to read authorizations

{{% code-placeholders "API_TOKEN" %}}
```sh
influx auth list --token API_TOKEN
```
{{% /code-placeholders %}}

Filtering options such as filtering by authorization ID, username, or user ID are available.
See the [`influx auth list` documentation](/influxdb3/cloud-serverless/reference/cli/influx/auth/list)
for information about other available flags.

{{% /tab-content %}}
<!---------------------------------- END CLI ---------------------------------->

<!--------------------------------- BEGIN API --------------------------------->
{{% tab-content %}}

## View tokens using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to view tokens and permissions.

{{< api-endpoint method="GET" endpoint="https://{{< influxdb/host >}}/api/v2/authorizations" api-ref="/influxdb3/cloud-serverless/api/#operation/GetAuthorizations" >}}

- [View a single token](#view-a-single-token)
- [Filter the token list](#filter-the-token-list)

Include the following in your request:

- **Headers**:
  - **Authorization**: `Token API_TOKEN`
    (API token with the [`read: authorizations`](/influxdb3/cloud-serverless/api/#operation/PostAuthorizations) permission)
  - **Content-type**: `application/json`

{{% code-placeholders "API_TOKEN" %}}
```sh
{{% get-shared-text "api/cloud-serverless/auth/tokens-view.sh" %}}
```
{{% /code-placeholders %}}

### View a single token

To view a specific authorization and token, include the authorization ID in the URL path.

{{% api-endpoint method="GET" endpoint="https://{{< influxdb/host >}}/api/v2/authorizations/{authID}" api-ref="/influxdb3/cloud-serverless/api/#operation/GetAuthorizationsID" %}}

Include the following in your request:

- **Headers**:
  - **Authorization**: `Token API_TOKEN`
    (API token with the [`read: authorizations`](/influxdb3/cloud-serverless/api/#operation/PostAuthorizations) permission)
  - **Content-type**: `application/json`

{{% code-placeholders "(API|AUTHORIZATION)_(TOKEN|ID)" %}}
```sh
curl --request GET \
	"https://us-west-2-1.aws.{{< influxdb/host >}}/api/v2/authorizations/AUTHORIZATION_ID" \
  --header "Authorization: Token API_TOKEN" \
  --header 'Content-type: application/json'
```
{{% /code-placeholders %}}

### Filter the token list

InfluxDB returns authorizations from the same organization as the token used in the request.
To filter tokens by user, include `userID` as a query parameter in your request.

{{% code-placeholders "API_TOKEN" %}}
```sh
{{% get-shared-text "api/cloud-serverless/auth/tokens-view-filter.sh" %}}
```
{{% /code-placeholders %}}

See the [`/authorizations` endpoint documentation](/influxdb3/cloud-serverless/api/#tag/Authorizations-(API-tokens))
for more information about available parameters.

{{% /tab-content %}}
<!---------------------------------- END API ---------------------------------->

{{< /tabs-wrapper >}}
