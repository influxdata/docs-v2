Manage tokens to authenticate and authorize access to resources and data in your {{< product-name >}} instance.

## Provide your token

Before running CLI commands or making HTTP API requests, you must provide a valid token to authenticate.

Use one of the following methods to provide your token:

{{< code-tabs-wrapper >}}

{{% code-tabs %}}
[CLI](#cli-auth)
[HTTP API](#http-api-auth)
{{% /code-tabs %}}

{{% code-tab-content %}}

{{% code-placeholders "your-token" %}}
```bash
# Export your token as an environment variable
export INFLUXDB3_AUTH_TOKEN=your-token
```
{{% /code-placeholders %}}

Replace `your-token` with your actual InfluxDB 3 token.

{{% /code-tab-content %}}

{{% code-tab-content %}}

{{% code-placeholders "your-token" %}}

```bash
# Add your token to the HTTP Authorization header
--header "Authorization: Bearer your-token"
```

{{% /code-placeholders %}}

Replace `your-token` with your actual InfluxDB 3 token.

{{% /code-tab-content %}}

{{< /code-tabs-wrapper >}}

{{< children hlevel="h2" readmore=true hr=true >}}
