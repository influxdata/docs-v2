---
title: Use tokens
seotitle: Use an authentication token in InfluxDB
description: Use an authentication token in InfluxDB using the InfluxDB UI, `influx` CLI, or InfluxDB API.
aliases:
  - /influxdb/v2.0/users/tokens/use-tokens
menu:
  influxdb_2_0:
    name: Use tokens
    parent: Manage tokens
weight: 204
---

Use tokens to authenticate requests to InfluxDB, including requests to write, query, and manage data and resources.
Authenticate requests using the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/), API requests made with client libraries, and tools like `curl`.

## Add a token to a CLI request

### Example: token on command line

```sh
influx write -t <token> -b BUCKET -o org-name <DATA>
```

### Example: token in environment variable

```
export INFLUX_TOKEN=my-token
influx write -b my-bucket -org my-org "meaurement field=1"
```

{{% note %}}
See [here](/influxdb/v2.0/write-data/no-code/use-telegraf/auto-config/#configure-your-token-as-an-environment-variable)
to configure environment variables on Windows.
(Click on the **Windows** tab.)
{{% /note %}}

### Use CLI configurations

Automatically manage and use tokens from the CLI using [`influx config`](/influxdb/v2.0/reference/cli/influx/config/).

## Use a token in an API request

Use tokens in [API requests](https://docs.influxdata.com/influxdb/v2.0/write-data/developer-tools/api/).

## Add a token to Postman

Make authenticated requests with tokens [using Postman](https://docs.influxdata.com/influxdb/v2.0/tools/postman/).
