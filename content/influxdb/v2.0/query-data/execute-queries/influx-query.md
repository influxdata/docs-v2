---
title: Use the `influx query` command
description: Use the influx CLI to query InfluxDB data.
weight: 204
menu:
  influxdb_2_0:
    name: Use the influx CLI
    parent: Execute queries
influxdb/v2.0/tags: [query]
---

Use the [`influx query` command](/influxdb/v2.0/reference/cli/influx/query) to query data in InfluxDB using Flux.
Pass Flux queries to the command as either a file or via stdin.

###### Run a query from a file

```bash
influx query --file /path/to/query.flux
```

###### Pass raw Flux via stdin pipe

```bash
influx query - # Return to open the pipe

data = from(bucket: "example-bucket") |> range(start: -10m) # ...
# ctrl-d to close the pipe and submit the query
```
