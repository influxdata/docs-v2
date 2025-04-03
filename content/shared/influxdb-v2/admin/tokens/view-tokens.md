
View API tokens and permissions using the InfluxDB user interface (UI),
the `influx` command line interface (CLI), or the InfluxDB API.

{{% note %}}

{{% show-in "v2" %}}Tokens are visible to the user who created the token. Users who own a token with operator permissions also have access to all tokens. Tokens stop working when the user who created the token is deleted.

In the InfluxDB UI, full tokens are only visible immediately after the token is created.

**We recommend creating a generic user to create and manage tokens for writing data.**
{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}
To follow best practices for secure API token generation and retrieval, InfluxDB Cloud enforces access restrictions on API tokens.
  - InfluxDB Cloud UI only allows access to the API token value immediately after the token is created.
  - You can't change access (**read/write**) permissions for an API token after it's created.
  - Tokens stop working when the user who created the token is deleted.

We recommend the following for managing your tokens:
- Create a generic user to create and manage tokens for writing data.
- Store your tokens in a secure password vault for future access.
{{% /show-in %}}
{{% /note %}}

## View tokens in the InfluxDB UI

{{% show-in "v2" %}}

1. In the navigation menu on the left, select **Data (Load Data)** > **API Tokens**.

{{< nav-icon "load-data" >}}

2. Click a token name in the list to view the token status and a summary of access permissions.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

1. In the navigation menu on the left, select **Load Data** > **API Tokens**.

{{< nav-icon "load-data" >}}

2. Click a token description in the list to view the token status and a list of access permissions.

{{% /show-in %}}

## View tokens using the influx CLI

Use the [`influx auth list` command](/influxdb/version/reference/cli/influx/auth/list)
to view tokens.

```sh
influx auth list
```

Filtering options such as filtering by authorization ID, username, or user ID are available.
See the [`influx auth list` documentation](/influxdb/version/reference/cli/influx/auth/list)
for information about other available flags.

## View tokens using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to view tokens and permissions.

{{< api-endpoint method="GET" endpoint="/api/v2/authorizations" api-ref="/influxdb/version/api/#operation/GetAuthorizations" >}}

Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| API token with the [`read: authorizations`](/influxdb/version/api/#operation/PostAuthorizations) permission  | Use the `Authorization: Token YOUR_API_TOKEN` header.                   |

```sh
{{% get-shared-text "api/v2.0/auth/oss/tokens-view.sh" %}}
```

### View a single token

To view a specific authorization and token, include the authorization ID in the URL path.

{{% api-endpoint method="GET" endpoint="/api/v2/authorizations/{authID}" api-ref="/influxdb/version/api/#operation/GetAuthorizationsID" %}}

### Filter the token list

InfluxDB returns authorizations from the same organization as the token used in the request.
To filter tokens by user, include `userID` as a query parameter in your request.

```sh
{{% get-shared-text "api/v2.0/auth/oss/tokens-view-filter.sh" %}}
```

{{% show-in "v2" %}}

[***Operator tokens***](/influxdb/version/admin/tokens/#operator-token) have access to all organizations' authorizations.
To filter authorizations by organization when using an operator token, include an `org` or `orgID` query parameter in your request.

{{% /show-in %}}

See the [`/authorizations` endpoint documentation](/influxdb/version/api/#tag/Authorizations-(API-tokens)) for more information about available parameters.
