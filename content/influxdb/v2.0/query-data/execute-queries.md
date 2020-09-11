---
title: Execute queries
seotitle: Different ways to query InfluxDB
description: There are multiple ways to query data from InfluxDB including the InfluxDB UI, CLI, and API.
weight: 103
menu:
  influxdb_2_0:
    name: Execute queries
    parent: Query data
influxdb/v2.0/tags: [query]
---

There are multiple ways to execute queries with InfluxDB.
This guide covers the different options:

- [Data Explorer](#data-explorer)
- [Flux REPL](#flux-repl)
- [Influx query command](#influx-query-command)
- [InfluxDB API](#influxdb-api)

## Data Explorer
Queries can be built, executed, and visualized in InfluxDB UI's Data Explorer.

![Data Explorer with Flux](/img/influxdb/2-0-data-explorer.png)

## Flux REPL
The [Flux REPL](/influxdb/v2.0/tools/repl/) starts an interactive
Read-Eval-Print Loop (REPL) where you can write and execute Flux queries.

```sh
./flux repl
```

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

## InfluxDB API
The [InfluxDB v2 API](/influxdb/v2.0/reference/api) provides a programmatic
interface for all interactions with InfluxDB.
Query InfluxDB through the `/api/v2/query` endpoint.
Queried data is returned in annotated CSV format.

In your request, set the following:

- Your organization via the `org` or `orgID` URL parameters.
- `Authorization` header to `Token ` + your authentication token.
- `Accept` header to `application/csv`.
- `Content-type` header to `application/vnd.flux`.
- Your plain text query as the request's raw data.

InfluxDB returns the query results in [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/).

{{% note %}}
#### Use gzip to compress the query response
To compress the query response, set the `Accept-Encoding` header to `gzip`.
This saves network bandwidth, but increases server-side load.
{{% /note %}}

Below is an example `curl` command that queries InfluxDB:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Without compression](#)
[With compression](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
curl http://localhost:9999/api/v2/query?org=my-org -XPOST -sS \
  -H 'Authorization: Token YOURAUTHTOKEN' \
  -H 'Accept: application/csv' \
  -H 'Content-type: application/vnd.flux' \
  -d 'from(bucket:"example-bucket")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "example-measurement"
        |> aggregateWindow(every: 1h, fn: mean)'
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl http://localhost:9999/api/v2/query?org=my-org -XPOST -sS \
  -H 'Authorization: Token YOURAUTHTOKEN' \
  -H 'Accept: application/csv' \
  -H 'Content-type: application/vnd.flux' \
  -H 'Accept-Encoding: gzip' \
  -d 'from(bucket:"example-bucket")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "example-measurement"
        |> aggregateWindow(every: 1h, fn: mean)'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
