---
title: Delete a token
seotitle: Delete an API token from InfluxDB
description: Delete an API token from InfluxDB using the InfluxDB UI or the `influx` CLI.
aliases:
  - /influxdb/v2.3/users/tokens/delete-token
menu:
  influxdb_2_3:
    name: Delete a token
    parent: Manage tokens
weight: 204
---

Delete API tokens from the InfluxDB user interface (UI) or the `influx` command line interface (CLI).
Once deleted, all users and external integrations using the API token will no longer
have access to your InfluxDB instance.

- [Delete tokens in the InfluxDB UI](#delete-tokens-in-the-influxdb-ui)
- [Delete a token using the influx CLI](#delete-a-token-using-the-influx-cli)
- [Delete a token using the InfluxDB API](#delete-a-token-using-the-influxdb-api)

## Delete tokens in the InfluxDB UI

{{% oss-only %}}

1. In the navigation menu on the left, select **Data (Load Data)** > **Tokens**.

{{< nav-icon "load-data" >}}

2. Hover over the token you want to delete.
3. Click the **{{< icon "delete" >}}** icon located far right of the token description.
3. Click **Delete** to delete the token.

{{% /oss-only %}}

{{% cloud-only %}}

1. In the navigation menu on the left, select **Load Data** > **API Tokens**.

{{< nav-icon "data" >}}

2. Find the token that you would like to delete.
3. Click the **{{< icon "delete" >}}** icon located far right of the token description.
4. Click **{{< caps >}}Confirm{{< /caps >}}** to delete the token.

{{% /cloud-only %}}

## Delete a token using the influx CLI

Use the [`influx auth delete` command](/influxdb/v2.3/reference/cli/influx/auth/delete)
to delete a token.

_This command requires an auth ID, which is available in the output of `influx auth find`._

```sh
# Syntax
influx auth delete -i <auth-id>

# Example
influx auth delete -i 03a2bee5a9c9a000
```

## Delete a token using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to delete a token.

[{{< api-endpoint method="DELETE" endpoint="http://localhost:8086/api/v2/authorizations/AUTH_ID" >}}](/influxdb/v2.3/api/#operation/DeleteAuthorizationsID)

Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| API token with the [`write: authorizations`](/influxdb/v2.3/api/#operation/PostAuthorizations) permission  | Use the `Authorization: Token YOUR_API_TOKEN` header. |
| Authorization ID     | URL path parameter. |

```sh
# Delete the first authorization listed for the user.
curl --request GET \
  "http://localhost:8086/api/v2/authorizations?user=user2" \
  --header "Authorization: Token ${INFLUX_OP_TOKEN}" \
  --header 'Content-type: application/json' \
| jq .authorizations[0].id \
| xargs -I authid curl --request DELETE \
  http://localhost:8086/api/v2/authorizations/authid \
  --header "Authorization: Token ${INFLUX_OP_TOKEN}" \
  --header 'Content-type: application/json'
```
