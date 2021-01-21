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
weight: 201
---

## Use tokens

Use tokens to authenticate requests to InfluxDB, including requests to write, query, and manage data and resources.
Authenticate requests using the `influx` command line, API requests made with client libraries, and
tools like `curl`.

### Example with token on command line

```sh
influx write -t <token> -b BUCKET -o org-name <DATA>
```

### Example with token in environment variable

```
export INFLUX_TOKEN=my-token
influx write -b my-bucket -org my-org "meaurement field=1"
```

## More examples
- Use tokens in [API requests](https://docs.influxdata.com/influxdb/v2.0/write-data/developer-tools/api/)
- Automatically manage and use tokens from the CLI using [`influx config`](/influxdb/v2.0/reference/cli/influx/config/).
- Make authenticated requests with tokens [using Postman](https://docs.influxdata.com/influxdb/v2.0/tools/postman/)
