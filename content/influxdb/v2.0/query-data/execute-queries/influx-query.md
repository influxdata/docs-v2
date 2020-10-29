---
title: Use the `influx query` command
weight: 204
menu:
  influxdb_2_0:
    name: Use the `influx query` command
    parent: Execute queries
influxdb/v2.0/tags: [query]
---

## Influx query command

You can pass queries to the [`influx query` command](/influxdb/v2.0/reference/cli/influx/query)
as either a file or raw Flux via stdin.

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
