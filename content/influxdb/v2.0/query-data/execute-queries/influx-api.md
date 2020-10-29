---
title: Query with the InfluxDB API
weight: 202
menu:
  influxdb_2_0:
    name: Query with the InfluxDB API
    parent: Execute queries
influxdb/v2.0/tags: [query]
---

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
curl http://localhost:8086/api/v2/query?org=my-org -XPOST -sS \
  --header 'Authorization: Token YOURAUTHTOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/vnd.flux' \
  --data 'from(bucket:"example-bucket")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> aggregateWindow(every: 1h, fn: mean)'
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```bash
curl --request POST http://localhost:8086/api/v2/query?org=my-org \
  --header 'Authorization: Token YOURAUTHTOKEN' \
  --header 'Accept: application/csv' \
  --header 'Content-type: application/vnd.flux' \
  --header 'Accept-Encoding: gzip' \
  --data 'from(bucket:"example-bucket")
        |> range(start: -12h)
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> aggregateWindow(every: 1h, fn: mean)'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
