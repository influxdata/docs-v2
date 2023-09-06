---
title: usage.limits() function
description: >
  `usage.limits()` returns a record containing usage limits for an **InfluxDB Cloud** organization.
menu:
  flux_v0_ref:
    name: usage.limits
    parent: experimental/usage
    identifier: experimental/usage/limits
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/usage/usage.flux#L305-L325

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`usage.limits()` returns a record containing usage limits for an **InfluxDB Cloud** organization.

### Example output record
```
{
    orgID: "123",
    rate: {
        readKBs: 1000,
        concurrentReadRequests: 0,
        writeKBs: 17,
        concurrentWriteRequests: 0,
        cardinality: 10000,
    },
    bucket: {maxBuckets: 2, maxRetentionDuration: 2592000000000000},
    task: {maxTasks: 5},
    dashboard: {maxDashboards: 5},
    check: {maxChecks: 2},
    notificationRule: {maxNotifications: 2, blockedNotificationRules: "comma, delimited, list"},
    notificationEndpoint: {blockedNotificationEndpoints: "comma, delimited, list"},
}
```

##### Function type signature

```js
(?host: string, ?orgID: string, ?token: string) => A
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### host

[InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/).
Default is `""`.

_(Required if executed outside of your InfluxDB Cloud organization or region)_.

### orgID

InfluxDB Cloud organization ID. Default is `""`.

_(Required if executed outside of your InfluxDB Cloud organization or region)_.

### token

InfluxDB Cloud [API token](/influxdb/cloud/security/tokens/).
Default is `""`.

_(Required if executed outside of your InfluxDB Cloud organization or region)_.


## Examples

- [Get rate limits for your InfluxDB Cloud organization](#get-rate-limits-for-your-influxdb-cloud-organization)
- [Get rate limits for a different InfluxDB Cloud organization](#get-rate-limits-for-a-different-influxdb-cloud-organization)
- [Output organization limits in a table](#output-organization-limits-in-a-table)
- [Output current cardinality with your cardinality limit](#output-current-cardinality-with-your-cardinality-limit)

### Get rate limits for your InfluxDB Cloud organization

```js
import "experimental/usage"

usage.limits()

```


### Get rate limits for a different InfluxDB Cloud organization

```js
import "experimental/usage"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUX_TOKEN")

usage.limits(
    host: "https://us-west-2-1.aws.cloud2.influxdata.com",
    orgID: "x000X0x0xx0X00x0",
    token: token,
)

```


### Output organization limits in a table

```js
import "array"
import "experimental/usage"

limits = usage.limits()

array.from(
    rows: [
        {
            orgID: limits.orgID,
            limitGroup: "rate",
            limitName: "Read (kb/s)",
            limit: limits.rate.readKBs,
        },
        {
            orgID: limits.orgID,
            limitGroup: "rate",
            limitName: "Concurrent Read Requests",
            limit: limits.rate.concurrentReadRequests,
        },
        {
            orgID: limits.orgID,
            limitGroup: "rate",
            limitName: "Write (kb/s)",
            limit: limits.rate.writeKBs,
        },
        {
            orgID: limits.orgID,
            limitGroup: "rate",
            limitName: "Concurrent Write Requests",
            limit: limits.rate.concurrentWriteRequests,
        },
        {
            orgID: limits.orgID,
            limitGroup: "rate",
            limitName: "Cardinality",
            limit: limits.rate.cardinality,
        },
        {
            orgID: limits.orgID,
            limitGroup: "bucket",
            limitName: "Max Buckets",
            limit: limits.bucket.maxBuckets,
        },
        {
            orgID: limits.orgID,
            limitGroup: "bucket",
            limitName: "Max Retention Period (ns)",
            limit: limits.bucket.maxRetentionDuration,
        },
        {
            orgID: limits.orgID,
            limitGroup: "task",
            limitName: "Max Tasks",
            limit: limits.task.maxTasks,
        },
        {
            orgID: limits.orgID,
            limitGroup: "dashboard",
            limitName: "Max Dashboards",
            limit: limits.dashboard.maxDashboards,
        },
        {
            orgID: limits.orgID,
            limitGroup: "check",
            limitName: "Max Checks",
            limit: limits.check.maxChecks,
        },
        {
            orgID: limits.orgID,
            limitGroup: "notificationRule",
            limitName: "Max Notification Rules",
            limit: limits.notificationRule.maxNotifications,
        },
    ],
)

```


### Output current cardinality with your cardinality limit

```js
import "experimental/usage"
import "influxdata/influxdb"

limits = usage.limits()
bucketCardinality = (bucket) =>
    (influxdb.cardinality(bucket: bucket, start: time(v: 0))
        |> findColumn(fn: (key) => true, column: "_value"))[0]

buckets()
    |> filter(fn: (r) => not r.name =~ /^_/)
    |> map(fn: (r) => ({bucket: r.name, Cardinality: bucketCardinality(bucket: r.name)}))
    |> sum(column: "Cardinality")
    |> map(fn: (r) => ({r with "Cardinality Limit": limits.rate.cardinality}))

```

