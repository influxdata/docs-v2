---
title: Use tokens
seotitle: Use an API token in InfluxDB
description: Use an API token in the InfluxDB UI, the `influx` CLI, or the InfluxDB API.
menu:
  influxdb_cloud_serverless:
    name: Use tokens
    parent: Manage tokens
weight: 204
---

Use tokens to authenticate requests to InfluxDB, including requests to write,
query, and manage data and resources.
Authenticate requests using the [`influx` CLI](/influxdb/v2.7/reference/cli/influx/),
API requests made with client libraries, and tools like cURL.

### Add a token to a CLI request

```sh
influx write \
  --token API_TOKEN \
  # ...
```

### Use environment variables

The `influx` CLI automatically uses the `INFLUX_TOKEN` variable when defined in
the current session.

### Use CLI configurations

Create [`influx` CLI connection configurations](/influxdb/cloud-serverless/reference/cli/influx/config/)
to automatically add your token and other required credentials to each CLI command execution.
