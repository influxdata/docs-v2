---
title: usage.limits() function
description: >
  The `usage.limits()` function returns a record containing usage limits for an
  **InfluxDB Cloud** organization.
menu:
  influxdb_2_0_ref:
    name: usage.limits
    parent: usage-exp
weight: 401
influxdb/v2.0/tags: [functions, cloud, rate limits]
---

The `usage.limits()` function returns a record containing usage limits for an
**InfluxDB Cloud** organization.


```js
import "experimental/usage"

usage.limits(
  host: "",
  orgID: "",
  token: ""
)
```

{{< expand-wrapper >}}
{{% expand "View example usage limits record" %}}
```js
{
  orgID: "123",
  rate: {
    readKBs: 1000,
    concurrentReadRequests: 0,
    writeKBs: 17,
    concurrentWriteRequests: 0,
    cardinality: 10000
  },
  bucket: {
    maxBuckets: 2,
    maxRetentionDuration: 2592000000000000
  },
  task: {
    maxTasks: 5
  },
  dashboard: {
    maxDashboards: 5
  },
  check: {
    maxChecks: 2
  },
  notificationRule: {
    maxNotifications: 2,
    blockedNotificationRules: "comma, delimited, list"
  },
  notificationEndpoint: {
    blockedNotificationEndpoints: "comma, delimited, list"
  }
}
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Parameters

### host{ data-type="string" }
[InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/) _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

_**Data type:** String_

### orgID
InfluxDB Cloud organization ID _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

_**Data type:** String_

### token
InfluxDB Cloud API token _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

_**Data type:** String_

## Examples

##### Get rate limits for your InfluxDB Cloud organization
```js
import "experimental/usage"

usage.limits()
```

##### Get rate limits for a different InfluxDB Cloud organization
```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

usage.limits(
  host: "https://cloud2.influxdata.com",
  orgID: "x000X0x0xx0X00x0",
  token: token
)
```
