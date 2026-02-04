---
title: Update a token
seotitle: Update API tokens in InfluxDB
description: Update API tokens' descriptions in InfluxDB using the InfluxDB UI.
menu:
  influxdb3_cloud_serverless:
    name: Update a token
    parent: Manage tokens
weight: 203
---

Update an API token's description and status using the InfluxDB user interface (UI),
`influx` CLI, or InfluxDB API.

- [Update a token in the InfluxDB UI](#update-a-token-in-the-influxdb-ui)
- [Enable or disable a token in the InfluxDB UI](#enable-or-disable-a-token-in-the-influxdb-ui)
- [Enable a token using the influx CLI](#enable-a-token-using-the-influx-cli)
- [Disable a token using the influx CLI](#disable-a-token-using-the-influx-cli)
- [Update a token using the InfluxDB API](#update-a-token-using-the-influxdb-api)

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

<!---------------------------------- BEGIN UI --------------------------------->
{{% tab-content %}}

## Update a token in the InfluxDB UI

To update tokens in the InfluxDB UI, navigate to the **API Tokens** management page.
In the navigation menu on the left, select **Load Data** > **API Tokens**.

{{< nav-icon "load-data" >}}

- [Update a token's description](#update-a-tokens-description)
- [Enable or disable a token in the InfluxDB UI](#enable-or-disable-a-token-in-the-influxdb-ui)

### Update a token's description

1.  On the [token management page](#update-a-token-in-the-influxdb-ui), click the
    pencil icon ({{< icon "pencil" >}}) next to the token's description.
2.  Update the token description, and then click anywhere else to save.

### Enable or disable a token in the InfluxDB UI

1.  On the [token management page](#update-a-token-in-the-influxdb-ui), find the
    token that you would like to enable or disable.
2.  Click the token description.
3.  Click the **{{< icon "toggle-blue" >}} Active** toggle.

{{% /tab-content %}}
<!----------------------------------- END UI ---------------------------------->

<!--------------------------------- BEGIN CLI --------------------------------->
{{% tab-content %}}

## Enable a token using the influx CLI

Use the [`influx auth active` command](/influxdb3/cloud-serverless/reference/cli/influx/auth/active)
to activate a token.

Provide the following flags:

- `--token`: API token with permission to update authorizations
- `--id`: Authorization ID to enable (available in the output of
  [`influx auth list`](/influxdb3/cloud-serverless/reference/cli/influx/auth/list))

{{% code-placeholders "(API|AUTHORIZATION)_(TOKEN|ID)" %}}
```sh
influx auth active \
  --token API_TOKEN \
  --id AUTHORIZATION_ID
```
{{% /code-placeholders %}}

### Disable a token using the influx CLI

Use the [`influx auth inactive` command](/influxdb3/cloud-serverless/reference/cli/influx/auth/active)
to deactivate a token.

Provide the following flags:

- `--token`: API token with permission to update authorizations
- `--id`: Authorization ID to disable (available in the output of
  [`influx auth list`](/influxdb3/cloud-serverless/reference/cli/influx/auth/list))

{{% code-placeholders "(API|AUTHORIZATION)_(TOKEN|ID)" %}}
```sh
influx auth inactive \
  --token API_TOKEN \
  --id AUTHORIZATION_ID
```
{{% /code-placeholders %}}

{{% /tab-content %}}
<!---------------------------------- END CLI ---------------------------------->

<!--------------------------------- BEGIN API --------------------------------->
{{% tab-content %}}

## Update a token using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to update the description
and status of a token.

{{< api-endpoint method="PATCH" endpoint="https://{{< influxdb/host >}}/api/v2/authorizations/{AUTH_ID}" api-ref="/influxdb/v2/api/#patch-/api/v2/authorizations/-authID-" >}}

Include the following in your request:

- **Headers**:
  - **Authorization**: `Token API_TOKEN`
    (API token with the [`write: authorizations`](/influxdb3/cloud-serverless/api/#post-/api/v2/authorizations) permission)
  - **Content-type**: `application/json`
- **Path parameters**:
  - **authID**: Authorization ID to update
- **Request body**: JSON object with
  [authorization properties](/influxdb3/cloud-serverless/admin/tokens/create-token/?t=InfluxDB+API#create-a-token-using-the-influxdb-api)
  to update

### Disable a token

{{% code-placeholders "API_TOKEN" %}}
```sh
# Update the description and status of the first authorization listed for the user.

curl --request GET \
  https://{{< influxdb/host >}}/api/v2/authorizations?user=user2 \
  --header "Authorization: Token API_TOKEN" \
  --header 'Content-type: application/json' \
| jq .authorizations[0].id \
| xargs -I authid curl --request PATCH \
  https://{{< influxdb/host >}}/api/v2/authorizations/authid \
  --header "Authorization: Token API_TOKEN" \
  --header 'Content-type: application/json' \
  --data '{
            "description": "deactivated_auth",
            "status": "inactive"
          }' | jq .
```
{{% /code-placeholders %}}

{{% /tab-content %}}
<!---------------------------------- END API ---------------------------------->
{{< /tabs-wrapper >}}