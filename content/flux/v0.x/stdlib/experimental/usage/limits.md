---
title: usage.limits() function
description: >
  The `usage.limits()` function returns a record containing usage limits for an
  **InfluxDB Cloud** organization.
menu:
  flux_0_x_ref:
    name: usage.limits
    parent: usage-exp
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/usage/limits/
  - /influxdb/cloud/reference/flux/stdlib/experimental/usage/limits/
weight: 401
related:
  - /flux/v0.x/stdlib/influxdata/influxdb/cardinality/
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

### host {data-type="string"}
[InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/) _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

### orgID {data-type="string"}
InfluxDB Cloud organization ID _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

### token {data-type="string"}
InfluxDB Cloud [API token](/influxdb/cloud/security/tokens/) _(Required if executed outside of your InfluxDB Cloud organization or region)_.
Default is `""`.

## Examples

- [Get rate limits for your InfluxDB Cloud organization](#get-rate-limits-for-your-influxdb-cloud-organization)
- [Get rate limits for a different InfluxDB Cloud organization](#get-rate-limits-for-a-different-influxdb-cloud-organization)
- [Output organization limits in a table](#output-organization-limits-in-a-table)
- [Output current cardinality with your cardinality limit](#output-current-cardinality-with-your-cardinality-limit)

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

usage.limits(host: "https://cloud2.influxdata.com", orgID: "x000X0x0xx0X00x0", token: token)
```

##### Output organization limits in a table
```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

limits = usage.limits(host: "https://cloud2.influxdata.com", orgID: "x000X0x0xx0X00x0", token: token)

array.from(
    rows: [
        {orgID: limits.orgID, limitGroup: "rate", limitName: "Read (kb/s)", limit: limits.rate.readKBs},
        {orgID: limits.orgID, limitGroup: "rate", limitName: "Concurrent Read Requests", limit: limits.rate.concurrentReadRequests},
        {orgID: limits.orgID, limitGroup: "rate", limitName: "Write (kb/s)", limit: limits.rate.writeKBs},
        {orgID: limits.orgID, limitGroup: "rate", limitName: "Concurrent Write Requests", limit: limits.rate.concurrentWriteRequests},
        {orgID: limits.orgID, limitGroup: "rate", limitName: "Cardinality", limit: limits.rate.cardinality},
        {orgID: limits.orgID, limitGroup: "bucket", limitName: "Max Buckets", limit: limits.bucket.maxBuckets},
        {orgID: limits.orgID, limitGroup: "bucket", limitName: "Max Retention Period (ns)", limit: limits.bucket.maxRetentionDuration},
        {orgID: limits.orgID, limitGroup: "task", limitName: "Max Tasks", limit: limits.task.maxTasks},
        {orgID: limits.orgID, limitGroup: "dashboard", limitName: "Max Dashboards", limit: limits.dashboard.maxDashboards},
        {orgID: limits.orgID, limitGroup: "check", limitName: "Max Checks", limit: limits.check.maxChecks},
        {orgID: limits.orgID, limitGroup: "notificationRule", limitName: "Max Notification Rules", limit: limits.notificationRule.maxNotifications},
    ],
)
```

##### Output current cardinality with your cardinality limit
```js
import "experimental/usage"
import "influxdata/influxdb"

limits = usage.limits()
bucketCardinality = (bucket) =>
    (influxdb.cardinality(
        bucket: bucket,
        start: time(v: 0),
    )
        |> findColumn(fn: (key) => true, column: "_value"))[0]

buckets()
    |> filter(fn: (r) => not r.name =~ /^_/)
    |> map(fn: (r) => ({bucket: r.name, Cardinality: bucketCardinality(bucket: r.name)}))
    |> sum(column: "Cardinality")
    |> map(fn: (r) => ({r with "Cardinality Limit": limits.rate.cardinality}))
```