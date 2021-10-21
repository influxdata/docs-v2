---
title: View tokens
seotitle: View API tokens in InfluxDB
description: View API tokens in InfluxDB using the InfluxDB UI, the `influx` CLI, or the InfluxDB API.
aliases:
  - /influxdb/v2.0/users/tokens/view-tokens
menu:
  influxdb_2_0:
    name: View tokens
    parent: Manage tokens
weight: 202
---

View API tokens and permissions using the InfluxDB user interface (UI),
the `influx` command line interface (CLI), or the InfluxDB API.

{{% note %}}
Tokens are visible to the user who created the token. {{% oss-only %}} Users who own a token with Operator permissions also have access to all tokens. {{% /oss-only %}} Tokens stop working when the user who created the token is deleted.
**We recommend creating a generic user to create and manage tokens for writing data.**
{{% /note %}}

## View tokens in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **Tokens**.

    {{< nav-icon "disks" >}}

2. Click a token name from the list to view the token and a summary of access permissions.

## View tokens using the influx CLI

Use the [`influx auth list` command](/influxdb/v2.0/reference/cli/influx/auth/list)
to view tokens.

```sh
influx auth list
```

Filtering options such as filtering by authorization ID, username, or user ID are available.
See the [`influx auth list` documentation](/influxdb/v2.0/reference/cli/influx/auth/list)
for information about other available flags.

## View tokens using the InfluxDB API

Use the `/authorizations` endpoint of the InfluxDB API to view tokens and permissions.

{{% api-endpoint method="GET" endpoint="/api/v2/authorizations" %}}

Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| API token with the [`read: authorizations`](/influxdb/v2.0/api/#operation/PostAuthorizations) permission  | Use the `Authorization: Token YOUR_API_TOKEN` header.                   |

```sh
{{% get-shared-text "api/v2.0/auth/oss/tokens-view.sh" %}}
```

### View a single token

To view a specific authorization and token, include the authorization ID in the URL path.

{{% api-endpoint method="GET" endpoint="/api/v2/authorizations/{authID}" %}}

### Filter the token list

InfluxDB returns authorizations from the same organization as the token used in the request.
To filter tokens by user, include `userID` as a query parameter in your request.

```sh
{{% get-shared-text "api/v2.0/auth/oss/tokens-view-filter.sh" %}}
```

[***Operator tokens***](/{{% latest "influxdb" %}}/security/tokens/#operator-token) have access to all organizations' authorizations.
To filter authorizations by organization when using an operator token, include an `org` or `orgID` query parameter in your request.

See the [`/authorizations` endpoint documentation](/influxdb/v2.0/api/#tag/Authorizations) for more information about available parameters.
