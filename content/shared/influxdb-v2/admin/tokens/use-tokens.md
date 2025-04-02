---
title: Use tokens
seotitle: Use an API token in InfluxDB
description: Use an API token in the InfluxDB UI, the `influx` CLI, or the InfluxDB API.
menu:
  influxdb_v2:
    name: Use tokens
    parent: Manage tokens
weight: 204
aliases:
  - /influxdb/v2/users/tokens/use-tokens
  - /influxdb/v2/security/tokens/use-tokens/
---

Use tokens to authenticate requests to InfluxDB, including requests to write, query, and manage data and resources.
Authenticate requests using the [`influx` CLI](/influxdb/v2/reference/cli/influx/), API requests made with client libraries, and tools like `curl`.

### Add a token to a CLI request

```sh
influx write -t <token> -b BUCKET -o org-name <LINE PROTOCOL>
```

```
export INFLUX_TOKEN=my-token
influx write -t $INFLUX_TOKEN -b my-bucket -o my-org "measurement field=1"
```

{{% note %}}
See [here](/influxdb/v2/write-data/no-code/use-telegraf/auto-config/#configure-your-token-as-an-environment-variable)
to configure environment variables on Windows.
(Click on the **Windows** tab.)
{{% /note %}}

### Use CLI configurations

Automatically manage and use tokens from the CLI using [`influx config`](/influxdb/v2/reference/cli/influx/config/).

### Use a token in an API request

Use tokens in [API requests](/influxdb/v2/api-guide/api_intro/#authentication).

### Use a token in Postman

Make authenticated requests with tokens [using Postman](/influxdb/v2/tools/postman/).
