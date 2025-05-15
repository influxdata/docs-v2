Manage tokens to authenticate and authorize access to resources and data in your {{< product-name >}} instance.

## Provide your token

Before running CLI commands or making HTTP API requests, you must provide a valid token to authenticate.
The mechanism for providing your token depends on the client you use to interact with {{% product-name %}}--for example:

{{< tabs-wrapper >}}

{{% tabs %}}
[influxdb3 CLI](#influxdb3-cli-auth)
[cURL](#curl-auth)
{{% /tabs %}}

{{% tab-content %}}

When using the `influxdb3` CLI, you can use the `--token` option to provide your authorization token.

{{% code-placeholders "YOUR_TOKEN" %}}
```bash
# Include the --token option in your influxdb3 command
influxdb3 query \
  --token YOUR_TOKEN \
  --database example-db \
  "SELECT * FROM 'example-table' WHERE time > now() - INTERVAL '10 minutes'"
```
{{% /code-placeholders %}}

You can also set the `INFLUXDB3_AUTH_TOKEN` environment variable to automatically provide your
authorization token to all `influxdb3` commands.

{{% code-placeholders "YOUR_TOKEN" %}}
```bash
# Export your token as an environment variable
export INFLUXDB3_AUTH_TOKEN=YOUR_TOKEN

# Run an influxdb3 command without the --token option
influxdb3 query \
  --database example-db \
  "SELECT * FROM 'example-table' WHERE time > now() - INTERVAL '10 minutes'"
```
{{% /code-placeholders %}}

Replace `YOUR_TOKEN` with your authorization token.

{{% /tab-content %}}

{{% tab-content %}}

{{% code-placeholders "AUTH_TOKEN" %}}

```bash
# Add your token to the HTTP Authorization header
curl "http://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data-urlencode "db=example-db" \
  --data-urlencode "q=SELECT * FROM 'example-table' WHERE time > now() - INTERVAL '10 minutes'"
```

{{% /code-placeholders %}}

Replace `your-token` with your actual InfluxDB 3 token.

{{% /tab-content %}}

{{< /tabs-wrapper >}}

{{< children hlevel="h2" readmore=true hr=true >}}
