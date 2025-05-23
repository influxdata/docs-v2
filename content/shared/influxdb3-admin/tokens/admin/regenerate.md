Use the `influxdb3` CLI or the HTTP API to regenerate an admin token.
Regenerate a token to rotate it as part of your security practices or if you suspect
the token has been compromised.

{{< show-in "enterprise" >}}
Regenerating an admin token deactivates the previous token,
stores the SHA512 hash and metadata of the new token, and returns the new token string.
{{< /show-in >}}
{{< show-in "core" >}}
Regenerating the admin token deactivates the previous token, updates the `_admin` token
SHA512 hash and metadata, and returns the new token string.
{{< /show-in >}}

An admin token grants access to all actions on the server.

## Prerequisite

To regenerate a token, you need the current token string.

## Use the CLI or HTTP API to regenerate an admin token

> [!Important]
> #### Securely store your token
>
> InfluxDB lets you view the token string only when you create the token.
> Store your token in a secure location, as you cannot retrieve it from the database later.
> InfluxDB 3 stores only the token's hash and metadata in the catalog.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#cli-regenerate-admin-token)
[HTTP API](#http-api-regenerate-admin-token)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------------BEGIN CLI----------------------------------->
Use the `--regenerate` flag with the
`influxdb3 create token --admin` subcommand--for example:

{{% code-placeholders "ADMIN_TOKEN" %}}
```bash
influxdb3 create token --admin \
  --token ADMIN_TOKEN \
  --regenerate
```
{{% /code-placeholders %}}

In your command,
replace {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}
with the current token string.

The CLI asks for confirmation before regenerating the token.
The output contains the new token string and InfluxDB deactivates the previous token string. 
<!----------------------------END CLI------------------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------BEGIN HTTP API----------------------------------->
Use the following HTTP API endpoint:

{{% api-endpoint method="POST" endpoint="/api/v3/configure/token/admin/regenerate" api-ref="/influxdb3/version/api/v3/configure/token/admin/regenerate" %}}

In your request, send an `Authorization` header with your current admin token string 
--for example:

{{% code-placeholders "ADMIN_TOKEN" %}}
```bash
curl -X POST "http://{{< influxdb/host >}}/api/v3/configure/token/admin/regenerate" \
  --header "Authorization: Bearer ADMIN_TOKEN" \
  --header "Accept: application/json"
```
{{% /code-placeholders %}}

In your command, replace {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}} with the current token string.

The output contains the new token string and InfluxDB deactivates the previous token string. 
<!------------------------END HTTP API ---------------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}
