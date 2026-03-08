---
title: Delete a token
seotitle: Delete an API token from InfluxDB
description: Delete an API token from InfluxDB using the InfluxDB UI or the `influx` CLI.
menu:
  influxdb3_cloud_serverless:
    name: Delete a token
    parent: Manage tokens
weight: 204
---

Delete API tokens using the InfluxDB user interface (UI), `influx` command line
interface (CLI), or InfluxDB API.
Once deleted, all users and external integrations using the API token will no longer
have access to your InfluxDB instance.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}

<!---------------------------------- BEGIN UI --------------------------------->
{{% tab-content %}}

## Delete tokens in the InfluxDB UI

1. In the navigation menu on the left, select **Load Data** > **API Tokens**.

    {{< nav-icon "data" >}}

2. Find the token that you would like to delete.
3. Click the **{{< icon "delete" >}}** icon located far right of the token description.
4. Click **{{< caps >}}Confirm{{< /caps >}}** to delete the token.

{{% /tab-content %}}
<!----------------------------------- END UI ---------------------------------->

<!--------------------------------- BEGIN CLI --------------------------------->
{{% tab-content %}}

## Delete a token using the influx CLI

Use the [`influx auth delete` command](/influxdb/v2/reference/cli/influx/auth/delete)
to delete a token.

Provide the following flags:

- `--token`: API token with permission to delete authorizations
- `--id`: Authorization ID to delete (available in the output of `influx auth find`)

{{% code-placeholders "(API|AUTHORIZATION)_(TOKEN|ID)" %}}
```sh
influx auth delete \
  --token API_TOKEN \
  --id AUTHORIZATION_ID
```
{{% /code-placeholders %}}

{{% /tab-content %}}
<!---------------------------------- END CLI ---------------------------------->

<!--------------------------------- BEGIN API --------------------------------->
{{% tab-content %}}

## Delete a token using the InfluxDB API

Use the `/api/v2/authorizations` InfluxDB API endpoint to delete a token.

{{< api-endpoint method="DELETE" endpoint="https://{{< influxdb/host >}}/api/v2/authorizations/{AUTH_ID}" api-ref="/influxdb/v2/api/#delete-/api/v2/authorizations/-authID-" >}}

Include the following in your request:

- **Headers**:
  - **Authorization**: `Token API_TOKEN`
    (API token with the [`write: authorizations`](/influxdb3/cloud-serverless/api/#post-/api/v2/authorizations) permission)
  - **Content-type**: `application/json`
- **Path parameters**:
  - **authID**: Authorization ID to delete

{{% code-placeholders "API_TOKEN" %}}
```sh
# Delete the first authorization listed for the user.
curl --request GET \
  https://{{< influxdb/host >}}/api/v2/authorizations?user=user2 \
  --header "Authorization: Token API_TOKEN" \
  --header 'Content-type: application/json' \
| jq .authorizations[0].id \
| xargs -I authid curl --request DELETE \
  https://{{< influxdb/host >}}/api/v2/authorizations/authid \
  --header "Authorization: Token API_TOKEN" \
  --header 'Content-type: application/json'
```
{{% /code-placeholders %}}

{{% /tab-content %}}
<!---------------------------------- END API ---------------------------------->
{{< /tabs-wrapper >}}
