---
title: usage.from() function
description: >
  `usage.from()` returns usage data from an **InfluxDB Cloud** organization.
menu:
  flux_v0_ref:
    name: usage.from
    parent: experimental/usage
    identifier: experimental/usage/from
weight: 201
flux/v0.x/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/usage/usage.flux#L178-L207

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`usage.from()` returns usage data from an **InfluxDB Cloud** organization.

### Output data schema
- **http_request** measurement
  - **req_bytes** field
  - **resp_bytes** field
  - **org_id** tag
  - **endpoint** tag
  - **status** tag
- **query_count** measurement
  - **req_bytes** field
  - **endpoint** tag
  - **orgID** tag
  - **status** tag
- **storage_usage_bucket_bytes** measurement
  - **gauge** field
  - **bucket_id** tag
  - **org_id** tag

##### Function type signature

```js
(
    start: A,
    stop: B,
    ?host: string,
    ?orgID: string,
    ?raw: C,
    ?token: string,
) => stream[D] where D: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### start
({{< req >}})
Earliest time to include in results.



### stop
({{< req >}})
Latest time to include in results.



### host

[InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/).
Default is `""`.

_(Required if executed outside of your InfluxDB Cloud organization or region)_.

### orgID

InfluxDB Cloud organization ID. Default is `""`.

_(Required if executed outside of your InfluxDB Cloud organization or region)_.

### token

InfluxDB Cloud [API token](/influxdb/cloud/admin/tokens/).
Default is `""`.

_(Required if executed outside of your InfluxDB Cloud organization or region)_.

### raw

Return raw, high resolution usage data instead of downsampled usage data.
Default is `false`.

`usage.from()` can query the following time ranges:
| Data resolution | Maximum time range |
| :-------------- | -----------------: |
| raw             |             1 hour |
| downsampled     |            30 days |


## Examples

- [Query downsampled usage data for your InfluxDB Cloud organization](#query-downsampled-usage-data-for-your-influxdb-cloud-organization)
- [Query raw usage data for your InfluxDB Cloud organization](#query-raw-usage-data-for-your-influxdb-cloud-organization)
- [Query downsampled usage data for a different InfluxDB Cloud organization](#query-downsampled-usage-data-for-a-different-influxdb-cloud-organization)
- [Query number of bytes in requests to the /api/v2/write endpoint](#query-number-of-bytes-in-requests-to-the-apiv2write-endpoint)
- [Query number of bytes returned from the /api/v2/query endpoint](#query-number-of-bytes-returned-from-the-apiv2query-endpoint)
- [Query the query count for InfluxDB Cloud query endpoints](#query-the-query-count-for-influxdb-cloud-query-endpoints)
- [Compare usage metrics to organization usage limits](#compare-usage-metrics-to-organization-usage-limits)

### Query downsampled usage data for your InfluxDB Cloud organization

```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

usage.from(start: -30d, stop: now())

```


### Query raw usage data for your InfluxDB Cloud organization

```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

usage.from(start: -1h, stop: now(), raw: true)

```


### Query downsampled usage data for a different InfluxDB Cloud organization

```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

usage.from(
    start: -30d,
    stop: now(),
    host: "https://us-west-2-1.aws.cloud2.influxdata.com",
    orgID: "x000X0x0xx0X00x0",
    token: token,
)

```


### Query number of bytes in requests to the /api/v2/write endpoint

```js
import "experimental/usage"

usage.from(start: -30d, stop: now())
    |> filter(fn: (r) => r._measurement == "http_request")
    |> filter(fn: (r) => r._field == "req_bytes")
    |> filter(fn: (r) => r.endpoint == "/api/v2/write")
    |> group(columns: ["_time"])
    |> sum()
    |> group()

```


### Query number of bytes returned from the /api/v2/query endpoint

```js
import "experimental/usage"

usage.from(start: -30d, stop: now())
    |> filter(fn: (r) => r._measurement == "http_request")
    |> filter(fn: (r) => r._field == "resp_bytes")
    |> filter(fn: (r) => r.endpoint == "/api/v2/query")
    |> group(columns: ["_time"])
    |> sum()
    |> group()

```


### Query the query count for InfluxDB Cloud query endpoints

The following query returns query counts for the following query endpoints:

- **/api/v2/query**: Flux queries
- **/query**: InfluxQL queries

```js
import "experimental/usage"

usage.from(start: -30d, stop: now())
    |> filter(fn: (r) => r._measurement == "query_count")
    |> sort(columns: ["_time"])

```


### Compare usage metrics to organization usage limits

The following query compares the amount of data written to and queried from your
InfluxDB Cloud organization to your organization's rate limits.
It appends a `limitReached` column to each row that indicates if your rate
limit was exceeded.

```js
import "experimental/usage"

limits = usage.limits()

checkLimit = (tables=<-, limit) =>
    tables
        |> map(fn: (r) => ({r with _value: r._value / 1000, limit: int(v: limit) * 60 * 5}))
        |> map(fn: (r) => ({r with limitReached: r._value > r.limit}))

read =
    usage.from(start: -30d, stop: now())
        |> filter(fn: (r) => r._measurement == "http_request")
        |> filter(fn: (r) => r._field == "resp_bytes")
        |> filter(fn: (r) => r.endpoint == "/api/v2/query")
        |> group(columns: ["_time"])
        |> sum()
        |> group()
        |> checkLimit(limit: limits.rate.readKBs)

write =
    usage.from(start: -30d, stop: now())
        |> filter(fn: (r) => r._measurement == "http_request")
        |> filter(fn: (r) => r._field == "req_bytes")
        |> filter(fn: (r) => r.endpoint == "/api/v2/write")
        |> group(columns: ["_time"])
        |> sum()
        |> group()
        |> checkLimit(limit: limits.rate.writeKBs)

union(tables: [read, write])

```

