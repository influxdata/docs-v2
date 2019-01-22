---
title: Execute Flux queries
seotitle: Different ways to execute Flux queries
description: There are multiple ways to execute Flux queries include the InfluxDB user interface, CLI, and API.
menu:
  v2_0:
    name: Execute Flux queries
    parent: How-to guides
    weight: 1
---

There are multiple ways to execute Flux queries with InfluxDB and Chronograf v1.7+.
This guide covers the different options:

1. [Data Explorer](#data-explorer)
2. [Influx REPL](#influx-repl)
3. [Influx query command](#influx-query-command)
5. [InfluxDB API](#influxdb-api)

## Data Explorer
Flux queries can be built, executed, and visualized in InfluxDB UI's Data Explorer.

![Data Explorer with Flux](/img/flux-data-explorer.png)

## Influx REPL
The [`influx repl` command](/v2.0/reference/cli/influx/repl) starts an interactive
read-eval-print-loop (REPL) where you can write and execute Flux queries.

```bash
influx repl --org org-name
```

## Influx query command
You can pass Flux queries to the [`influx query` command](/v2.0/reference/cli/influx/query)
as either a file or raw Flux via stdin.

###### Run a Flux query from a file
```bash
influx query @/path/to/query.flux
```

###### Pass raw Flux via stdin pipe
```bash
influx query - # Return to open the pipe

data = from(bucket: "example-bucket") |> range(start: -10m) # ...
# ctrl-d to close the pipe and submit the query
```

## InfluxDB API
Query InfluxDB through the `/api/v2/query` endpoint.
Queried data is returned in annotated CSV format.

In your request, set the following:

- `Authorization` header to `Token ` + your authentication token.
- `accept` header to `application/csv`
- `content-type` header to `application/vnd.flux`

This allows you to POST the Flux query in plain text and receive the annotated CSV response.

Below is an example `curl` command that queries InfluxDB:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Multi-line](#)
[Single-line](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
curl http://localhost:9999/api/v2/query -XPOST -sS \
-H 'Authorization: Token YOURAUTHTOKEN' \
-H 'accept:application/csv' \
-H 'content-type:application/vnd.flux' \
-d 'from(bucket:“test”)
      |> range(start:-1000h)
      |> group(columns:[“_measurement”], mode:“by”)
      |> sum()'
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl http://localhost:9999/api/v2/query -XPOST -sS -H 'Authorization: Token TOKENSTRINGHERE' -H 'accept:application/csv' -H 'content-type:application/vnd.flux' -d 'from(bucket:“test”) |> range(start:-1000h) |> group(columns:[“_measurement”], mode:“by”) |> sum()'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
