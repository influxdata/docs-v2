
Use tokens to authenticate requests to InfluxDB, including requests to write, query, and manage data and resources.
Authenticate requests using the [`influx` CLI](/influxdb/version/reference/cli/influx/), API requests made with client libraries, and tools like `curl`.

### Add a token to a CLI request

```sh
influx write -t <token> -b BUCKET -o org-name <LINE PROTOCOL>
```

```
export INFLUX_TOKEN=my-token
influx write -t $INFLUX_TOKEN -b my-bucket -o my-org "measurement field=1"
```

{{% note %}}
See [here](/influxdb/version/write-data/no-code/use-telegraf/auto-config/#configure-your-token-as-an-environment-variable)
to configure environment variables on Windows.
(Click on the **Windows** tab.)
{{% /note %}}

### Use CLI configurations

Automatically manage and use tokens from the CLI using [`influx config`](/influxdb/version/reference/cli/influx/config/).

### Use a token in an API request

Use tokens in [API requests](/influxdb/version/api-guide/api_intro/#authentication).

### Use a token in Postman

Make authenticated requests with tokens [using Postman](/influxdb/version/tools/postman/).
