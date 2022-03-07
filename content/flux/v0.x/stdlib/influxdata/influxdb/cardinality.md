---
title: influxdb.cardinality() function
description: The `influxdb.cardinality()` function returns the series cardinality of data stored in InfluxDB.
menu:
  flux_0_x_ref:
    name: influxdb.cardinality
    parent: influxdb-pkg
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/influxdb/cardinality/
  - /influxdb/cloud/reference/flux/stdlib/influxdb/cardinality/
  - /flux/v0.x/stdlib/influxdb/cardinality/
weight: 302
flux/v0.x/tags: [metadata]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/spec/#show-cardinality, SHOW CARDINALITY in InfluxQL
  - /flux/v0.x/stdlib/experimental/usage/limits/
introduced: 0.92.0
---

The `influxdb.cardinality()` function returns the [series cardinality](/{{< latest "influxdb" "v2" >}}/reference/glossary#series-cardinality) of a specified dataset in InfluxDB.

```js
import "influxdata/influxdb"

influxdb.cardinality(
    bucket: "example-bucket",
    org: "example-org",
    host: "https://cloud2.influxdata.com",
    token: "MySuP3rSecr3Tt0k3n",
    start: -30d,
    stop: now(),
    predicate: (r) => true,
)

// OR

influxdb.cardinality(
    bucketID: "00xXx0x00xXX0000",
    orgID: "00xXx0x00xXX0000",
    host: "https://cloud2.influxdata.com",
    token: "MySuP3rSecr3Tt0k3n",
    start: -30d,
    stop: now(),
    predicate: (r) => true,
)
```

## Parameters

### bucket {data-type="string"}
Bucket to query cardinality from.

### bucketID {data-type="string"}
String-encoded bucket ID to query cardinality from.

### org {data-type="string"}
Organization name.

### orgID {data-type="string"}
String-encoded [organization ID](/influxdb/cloud/organizations/view-orgs/#view-your-organization-id) to query cardinality from.

### host {data-type="string"}
URL of the InfluxDB instance to query.
_See [InfluxDB Cloud regions](/influxdb/cloud/reference/regions) or
[InfluxDB OSS URLs](/{{< latest "influxdb" "v2" >}}/reference/urls/)._

### token {data-type="string"}
InfluxDB [API token](/{{< latest "influxdb" "v2" >}}/security/tokens/).

### start {data-type="duration, time"}
The earliest time to include when calculating cardinality.
The cardinality calculation **includes** points that match the specified start time.
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to [`now()`](/flux/v0.x/stdlib/universe/now/).

### stop {data-type="duration, time"}
The latest time to include when calculating cardinality.
The cardinality calculation **excludes** points that match the specified start time.
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to [`now()`](/flux/v0.x/stdlib/universe/now/).
_Default is `now()`_.

### predicate {data-type="function"}
Predicate function that filters records.
_Default is `(r) => true`_.

## Examples

- [Query series cardinality in a bucket](#query-series-cardinality-in-a-bucket)
- [Query series cardinality in a measurement](#query-series-cardinality-in-a-measurement)
- [Query series cardinality for a specific tag](#query-series-cardinality-for-a-specific-tag)
- [Query total cardinality across all buckets](#query-total-cardinality-across-all-buckets)

##### Query series cardinality in a bucket
```js
import "influxdata/influxdb"

influxdb.cardinality(bucket: "example-bucket", start: -1y)
```

##### Query series cardinality in a measurement
```js
import "influxdata/influxdb"

influxdb.cardinality(
    bucket: "example-bucket",
    start: -1y,
    predicate: (r) => r._measurement == "example-measurement",
)
```

##### Query series cardinality for a specific tag
```js
import "influxdata/influxdb"

influxdb.cardinality(
    bucket: "example-bucket",
    start: -1y,
    predicate: (r) => r.exampleTag == "foo",
)
```

##### Query total cardinality across all buckets
```js
import "influxdata/influxdb"

bucketCardinality = (bucket) => (influxdb.cardinality(bucket: bucket, start: time(v: 0))
    |> findColumn(fn: (key) => true, column: "_value"))[0]

buckets()
    |> filter(fn: (r) => not r.name =~ /^_/)
    |> map(fn: (r) => ({bucket: r.name, "Total Cardinality": bucketCardinality(bucket: r.name)}))
    |> sum(column: "Total Cardinality")
```
