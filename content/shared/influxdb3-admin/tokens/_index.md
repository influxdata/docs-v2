Manage tokens to authenticate and authorize access to server actions, resources, and data in your {{< product-name >}} instance.

## Provide your token

If you start the {{< product-name >}} server with authentication enabled (the default), future server actions (CLI commands and HTTP API requests) require a valid token for authorization.

The first admin token you create is the _operator_ token (named `_admin`), which has full administrative privileges.
You can use the operator token to authenticate your requests and manage additional authorization tokens.

The mechanism for providing your token depends on the client you use to interact with {{% product-name %}}--for example:

{{< tabs-wrapper >}}
{{% tabs %}}
[influxdb3 CLI](#influxdb3-cli-auth)
[HTTP API](#http-api-auth)
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

To authenticate directly to the HTTP API, you can include your authorization token in the HTTP Authorization header of your request.
The `Authorization: Bearer AUTH_TOKEN` scheme works with all HTTP API endpoints that require authentication.

The following examples use `curl` to show to authenticate to the HTTP API.


{{% code-placeholders "YOUR_AUTH_TOKEN" %}}
```bash
# Add your token to the HTTP Authorization header
curl "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --header "Authorization: Bearer YOUR_AUTH_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM 'DATABASE_NAME' WHERE time > now() - INTERVAL '10 minutes'"
```

### Authenticate using v1 and v2 compatibility

```bash
# Token scheme with v2 /api/v2/write
curl http://localhost:8181/api/v2/write\?bucket\=DATABASE_NAME \
  --header "Authorization: Token YOUR_AUTH_TOKEN" \
  --data-raw "home,room=Kitchen temp=23.5 1622547800"
```

```bash
# Basic scheme with v1 /write
# Username is ignored, but required for the request
# Password is your auth token encoded in base64
curl "http://localhost:8181/write?db=DATABASE_NAME" \
  --user "admin:YOUR_AUTH_TOKEN" \
  --data-raw "home,room=Kitchen temp=23.5 1622547800"
```

```bash
# URL auth parameters with v1 /write
# Username is ignored, but required for the request
curl "http://localhost:8181/write?db=DATABASE_NAME&u=admin&p=YOUR_AUTH_TOKEN" \
  --data-raw "home,room=Kitchen temp=23.5 1622547800"
```
{{% /code-placeholders %}}
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following with your values:

- {{% code-placeholder-key %}}`YOUR_AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/version/admin/databases) you want to query

To use tokens with other clients for {{< product-name >}},
see the client-specific documentation:

- [InfluxDB 3 Explorer](/influxdb3/explorer/)
- [InfluxDB client libraries](/influxdb3/version/reference/client-libraries/)
- [Telegraf](/telegraf/v1/)
- [Grafana](/influxdb3/version/visualize-data/grafana/)

{{< children hlevel="h2" readmore=true hr=true >}}
