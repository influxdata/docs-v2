
Update an API token's description and status.
using the InfluxDB user interface (UI).

- [Update a token in the InfluxDB UI](#update-a-token-in-the-influxdb-ui)
- [Enable or disable a token in the InfluxDB UI](#enable-or-disable-a-token-in-the-influxdb-ui)
- [Enable a token using the influx CLI](#enable-a-token-using-the-influx-cli)
- [Disable a token using the influx CLI](#disable-a-token-using-the-influx-cli)
- [Update a token using the InfluxDB API](#update-a-token-using-the-influxdb-api)

## Update a token in the InfluxDB UI

1. In the navigation menu on the left, select **Data (Load Data)** > **API Tokens**.

{{< nav-icon "load-data" >}}

2. Click the pencil icon {{< icon "pencil" >}} next to the token's name in the **Description** column.
3. Update the token description, then click anywhere else to save.

## Enable or disable a token in the InfluxDB UI

{{% show-in "v2" %}}

1. In the navigation menu on the left, select **Data (Load Data)** > **API Tokens**.

{{< nav-icon "load-data" >}}

2. Click the **{{< icon "toggle" >}} Status** toggle.

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

1. In the navigation menu on the left, select **Load Data** > **API Tokens**.

    {{< nav-icon "data" >}}

2. Find the token that you would like to enable or disable.
3. Click the token description.
4. Click the **{{< icon "toggle-blue" >}} Status** toggle.

{{% /show-in %}}

## Enable a token using the influx CLI

Use the [`influx auth active` command](/influxdb/version/reference/cli/influx/auth/active)
to activate a token.

_This command requires an authorization ID, which is available in the output of `influx auth find`._

```sh
# Syntax
influx auth active -i <auth-id>

# Example
influx auth active -i 0804f74142bbf000
```
To get the current status of a token, use the JSON output of the [`influx auth list` command](/influxdb/version/reference/cli/influx/auth/list).

```sh
influx auth find --json
```

### Disable a token using the influx CLI

Use the [`influx auth inactive` command](/influxdb/version/reference/cli/influx/auth/active)
to deactivate a token.

_This command requires an authorization ID, which is available in the output of `influx auth find`._

```sh
# Syntax
influx auth inactive -i <auth-id>

# Example
influx auth inactive -i 0804f74142bbf000
```

To get the current status of a token, use the JSON output of the [`influx auth list` command](/influxdb/version/reference/cli/influx/auth/list).

```sh
influx auth find --json
```

## Update a token using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to update the description and status of a token.

{{< api-endpoint method="PATCH" endpoint="http://localhost:8086/api/v2/authorizations/AUTH_ID" api-ref="/influxdb/version/api/#patch-/api/v2/authorizations/-authID-" >}}

Include the following in your request:

| Requirement          | Include by                                               |
|:-----------          |:----------                                               |
| API token with the [`write: authorizations`](/influxdb/version/api/#post-/api/v2/authorizations) permission  | Use the `Authorization: Token YOUR_API_TOKEN` header. |
| Authorization ID     | URL path parameter.                                      |
| Description and/or Status | Pass as `description`, `status` in the request body.    |

### Disable a token

```sh
# Update the description and status of the first authorization listed for the user.

curl --request GET \
  "http://localhost:8086/api/v2/authorizations?user=user2" \
  --header "Authorization: Token ${INFLUX_TOKEN}" \
  --header 'Content-type: application/json' \
| jq .authorizations[0].id \
| xargs -I authid curl --request PATCH \
  http://localhost:8086/api/v2/authorizations/authid \
  --header "Authorization: Token ${INFLUX_TOKEN}" \
  --header 'Content-type: application/json' \
  --data '{
            "description": "deactivated_auth",
            "status": "inactive"
          }' | jq .
```
