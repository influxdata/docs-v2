Manage tokens to authenticate and authorize access to server actions, resources, and data in your {{< product-name >}} instance.

## Provide your token

If you start the {{< product-name >}} server with authentication enabled (the default), future server actions (CLI commands and HTTP API requests) require a valid token for authorization.

The first admin token you create is the _operator_ token (named `_admin`), which has full administrative privileges.
You can use the operator token to authenticate your requests and manage additional authorization tokens.

The mechanism for providing your token depends on the client you use to interact with {{% product-name %}}--for example:

{{< tabs-wrapper >}}
{{% tabs %}}
[influxdb3 CLI](#influxdb3-cli-auth)
[cURL](#curl-auth)
{{% /tabs %}}
{{% tab-content %}}

When using the `influxdb3` CLI, you can set the `INFLUXDB3_AUTH_TOKEN` environment variable to automatically provide your
authorization token to all `influxdb3` commands--for example:

{{% code-placeholders "YOUR_AUTH_TOKEN" %}}
```bash
# Export your token as an environment variable
export INFLUXDB3_AUTH_TOKEN=YOUR_AUTH_TOKEN

# Run an influxdb3 command
influxdb3 query \
  --database DATABASE_NAME \
  "SELECT * FROM 'DATABASE_NAME' WHERE time > now() - INTERVAL '10 minutes'"
```
{{% /code-placeholders %}}

To specify a token in the command and override the environment variable, pass the `--token` option with your authorization token--for example:

{{% code-placeholders "YOUR_AUTH_TOKEN" %}}
```bash
# Include the --token option in your influxdb3 command
influxdb3 query \
  --token YOUR_AUTH_TOKEN \
  --database DATABASE_NAME \
  "SELECT * FROM 'DATABASE_NAME' WHERE time > now() - INTERVAL '10 minutes'"
```
{{% /code-placeholders %}}

You can also set the `INFLUXDB3_AUTH_TOKEN` environment variable to automatically provide your
authorization token to all `influxdb3` commands.

{{% /tab-content %}}
{{% tab-content %}}

{{% code-placeholders "YOUR_AUTH_TOKEN" %}}
```bash
# Add your token to the HTTP Authorization header
curl "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --header "Authorization: Bearer YOUR_AUTH_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM 'DATABASE_NAME' WHERE time > now() - INTERVAL '10 minutes'"
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following with your values:

- {{% code-placeholder-key %}}`YOUR_AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database you want to query

{{< children hlevel="h2" readmore=true hr=true >}}
