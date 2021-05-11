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
---

The `usage.from()` function returns usage data from an **InfluxDB Cloud** organization.

```js
import "experimental/usage"

usage.from(
  start: -30d,
  stop: now(),
  host: "",
  orgID: "",
  token: "",
  raw: false
)
```

{{< expand-wrapper >}}
{{% expand "View usage data schema" %}}
- **storage_usage_bucket_bytes** measurement
  - **gauge** field
  - **bucket_id** tag
  - **org_id** tag
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

<!--
- **queryd_billing** measurement
- **storage_usage_bucket_cardinality** measurement
- **events** measurement
-->
{{% /expand %}}
{{< /expand-wrapper >}}


## Parameters

### start {data-type="time, duration"}
({{< req >}})
Earliest time to include in results.

### stop {data-type="time, duration"}
({{< req >}})
Earliest time to include in results.

### host {data-type="string"}
[InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/) _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

### orgID {data-type="string"}
InfluxDB Cloud organization ID _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

### token {data-type="string"}
InfluxDB Cloud [authentication token](/influxdb/v2.0/security/tokens/) _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

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

##### Query downsampled usage data for your InfluxDB Cloud organization
```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

usage.from(
  start: -30d,
  stop: now()
)
```

##### Query raw usage data for your InfluxDB Cloud organization
```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

usage.from(
  start: -1h,
  stop: now(),
  raw: true
)
```

##### Query downsampled usage data for a different InfluxDB Cloud organization
```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

usage.from(
  start: -30d,
  stop: now(),
  host: "https://cloud2.influxdata.com",
  orgID: "x000X0x0xx0X00x0",
  token: token
)
```