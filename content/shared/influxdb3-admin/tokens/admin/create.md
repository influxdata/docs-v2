Use the [`influxdb3 create token --admin` subcommand](/influxdb3/version/reference/cli/influxdb3/create/token/)
with the `--name` option or the HTTP API [`/api/v3/configure/token/admin`](/influxdb3/version/api/v3/) endpoint
to create an admin token for your {{< product-name omit="Clustered" >}} instance.
An admin token grants full access to all actions for your InfluxDB 3 instance and can be referenced by its name.

{{% product-name omit="Clustered" %}} supports two types of admin tokens:
- **Operator token**: A system-generated administrative token with the name `_admin`.
  - Cannot be edited or deleted
  - Never expires
  - Cannot be recreated if lost (future functionality)
  - Can be regenerated using the CLI
- **Named admin token**: User-defined administrative tokens with full admin permissions.
  - Can be created, edited, and deleted
  - Support expiration dates
  - Cannot modify or remove the operator token

An {{% product-name omit="Clustered" %}} instance can have one operator token and unlimited named admin tokens.

[Create an operator token](#create-an-operator-token)
[Create a named admin token](#create-a-named-admin-token)

> [!Note]
> #### Store secure tokens in a secret store
> 
> Token strings are returned _only_ on token creation.
> We recommend storing database tokens in a **secure secret store**.
> Anyone with access to the named admin token has full control over your {{< product-name >}} instance.
> If you lose the named admin token string, you must regenerate the token.

## Create an operator token

The first admin token your create for your {{% product-name %}}
instance is the operator token.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#use-the-influxdb3-cli)
[HTTP API](#use-the-http-api)
{{% /tabs %}}
{{% tab-content %}}
Use the `influxdb3 create token --admin` command without a token name:

```bash
influxdb3 create token --admin
```

{{% /tab-content %}}
{{% tab-content %}}
Use the following endpoint to create an operator token:

{{% api-endpoint method="POST" endpoint="/api/v3/configure/token/admin" api-ref="/influxdb3/version/api/v3/#post-/api/v3/configure/token/admin" %}}

```bash
curl -X POST "http://{{< influxdb/host >}}/api/v3/configure/token/admin" \
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

The output contains the token string in plain text.

## Create a named admin token

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#use-the-influxdb3-cli)
[HTTP API](#use-the-http-api)
{{% /tabs %}}
{{% tab-content %}}
Use the `influxdb3 create token --admin` command with a token name:

{{% code-placeholders "TOKEN_NAME|ADMIN_TOKEN" %}}
```bash
influxdb3 create token --admin --token ADMIN_TOKEN --name "TOKEN_NAME"
```
{{% /code-placeholders %}}

Replace the following with your values:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: your existing operator or named admin token
- {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}}: the name you want to assign to the new admin token

The output contains the token string in plain text.

{{% /tab-content %}}
{{% tab-content %}}
Use the following endpoint to create a named admin token:

{{% api-endpoint method="POST" endpoint="/api/v3/configure/token/admin" api-ref="/influxdb3/version/api/v3/#post-/api/v3/configure/token/admin" %}}

```bash
curl -X POST "http://{{< influxdb/host >}}/api/v3/configure/token/admin" \
  --header 'Authorization Bearer ADMIN_TOKEN' \
  --json '{
            "name": "TOKEN_NAME"
          }'
```
Replace the following with your values:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: your existing operator or named admin token
- {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}}: the name you want to assign to the new admin token

The response body contains the token string in plain text.
{{% /tab-content %}}
{{< /tabs-wrapper >}}

_To use the token as the default for later commands, and to persist the token
across sessions, assign the token string to the `INFLUXDB3_AUTH_TOKEN` environment variable._
