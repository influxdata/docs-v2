---
title: usage.from() function
description: >
  The `usage.from()` function returns usage data from an **InfluxDB Cloud** organization.
menu:
  flux_0_x_ref:
    name: usage.from
    parent: usage-exp
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/usage/from/
  - /influxdb/cloud/reference/flux/stdlib/experimental/usage/from/
weight: 401
flux/v0.x/tags: [inputs]
related:
  - /influxdb/cloud/account-management/data-usage/
  - /influxdb/cloud/account-management/limits/
---

`usage.from()` returns usage data from an **InfluxDB Cloud** organization.
Use `usage.from()` to monitor your InfluxDB Cloud organization's usage and identify
anomalies or rate limiting.

```js
import "experimental/usage"

usage.from(
    start: -30d,
    stop: now(),
    host: "",
    orgID: "",
    token: "",
    raw: false,
)
```

### Usage data schema
InfluxDB Cloud usage data is reported and reset every five minutes.

- **storage_usage_bucket_bytes** _(measurement)_
  - **gauge** _(field)_: Number of bytes on disk associated with a bucket.
  - **bucket_id** _(tag)_: Bucket ID.
  - **org_id** _(tag)_: Organization ID.
- **http_request** _(measurement)_
  - **req_bytes** _(field)_: Total number of bytes in HTTP request bodies
    per endpoint and status code.
  - **resp_bytes** _(field)_: Total number of bytes in HTTP response bodies
    per endpoint and status code.
  - **org_id** _(tag)_: Organization ID.
  - **endpoint** _(tag)_: InfluxDB Cloud API endpoint.
  - **status** _(tag)_: HTTP status code.
- **query_count** _(measurement)_
  - **req_bytes** _(field)_: Number of queries executed.
  - **endpoint** _(tag)_: InfluxDB Cloud API endpoint.
  - **orgID** _(tag)_: Organization ID.
  - **status** _(tag)_: HTTP status code.

## Parameters

### start {data-type="time, duration"}
({{< req >}})
Earliest time to include in results.

### stop {data-type="time, duration"}
({{< req >}})
Latest time to include in results.

### host {data-type="string"}
[InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/).
Default is `""`.
_If an empty string, the function uses the host that the query is executed from._

### orgID {data-type="string"}
InfluxDB Cloud organization ID.
Default is `""`.
_If an empty string, the function uses the ID of the organization that executes the query._

### token {data-type="string"}
InfluxDB Cloud [API token](/influxdb/cloud/security/tokens/).
Default is `""`.
_If an empty string, the function uses an API token associated with the user that executes the query._
**The API token must be an [All-Access token](/influxdb/cloud/security/tokens/#all-access-token)**.

### raw {data-type="bool"}
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

usage.from(start: -30d, stop: now())
```

### Query raw usage data for your InfluxDB Cloud organization
```js
import "experimental/usage"

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
    host: "https://cloud2.influxdata.com",
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

```javascript
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

checkLimit = (tables=<-, limit) => tables
    |> map(fn: (r) => ({r with _value: r._value / 1000, limit: int(v: limit) * 60 * 5}))
    |> map(fn: (r) => ({r with limitReached: r._value > r.limit}))

read = usage.from(start: -30d, stop: now())
    |> filter(fn: (r) => r._measurement == "http_request")
    |> filter(fn: (r) => r._field == "resp_bytes")
    |> filter(fn: (r) => r.endpoint == "/api/v2/query")
    |> group(columns: ["_time"])
    |> sum()
    |> group()
    |> checkLimit(limit: limits.rate.readKBs)

write = usage.from(start: -30d, stop: now())
    |> filter(fn: (r) => r._measurement == "http_request")
    |> filter(fn: (r) => r._field == "req_bytes")
    |> filter(fn: (r) => r.endpoint == "/api/v2/write")
    |> group(columns: ["_time"])
    |> sum()
    |> group()
    |> checkLimit(limit: limits.rate.writeKBs)

union(tables: [read, write])
```
