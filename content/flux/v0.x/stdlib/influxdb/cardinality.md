---
title: influxdb.cardinality() function
description: The `influxdb.cardinality()` function returns the series cardinality of data stored in InfluxDB Cloud.
menu:
  flux_0_x_ref:
    name: influxdb.cardinality
    parent: influxdb-pkg
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/influxdb/cardinality/
  - /influxdb/cloud/reference/flux/stdlib/influxdb/cardinality/
weight: 301
influxdb/v2.0/tags: [cardinality]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/spec/#show-cardinality, SHOW CARDINALITY in InfluxQL
introduced: 0.92.0
---

The `influxdb.cardinality()` function returns the [series cardinality](/{{< latest "influxdb" "v2" >}}/reference/glossary#series-cardinality) of data stored in InfluxDB Cloud.

{{% cloud %}}
**InfluxDB Cloud** supports the `influxdb.cardinality()` function, but **InfluxDB OSS does not**.
{{% /cloud %}}

```js
import "influxdata/influxdb"

influxdb.cardinality(
  bucket: "example-bucket",
  org: "example-org",
  host: "https://cloud2.influxdata.com",
  token: "MySuP3rSecr3Tt0k3n",
  start: -30d,
  stop: now(),
  predicate: (r) => true
)

// OR

influxdb.cardinality(
  bucketID: "00xXx0x00xXX0000",
  orgID: "00xXx0x00xXX0000",
  host: "https://cloud2.influxdata.com",
  token: "MySuP3rSecr3Tt0k3n",
  start: -30d,
  stop: now(),
  predicate: (r) => true
)
```

## Parameters

### bucket
Bucket to query cardinality from.

_**Data type:** String_

### bucketID
String-encoded bucket ID to query cardinality from.

_**Data type:** String_

### org
Organization name.

_**Data type:** String_

### orgID
String-encoded [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id) to query cardinality from.

_**Data type:** String_

### host
URL of the InfluxDB instance to query.
_See [InfluxDB Cloud regions](/influxdb/cloud/reference/regions) or
[InfluxDB OSS URLs](/{{< latest "influxdb" "v2" >}}/reference/urls/)._

_**Data type:** String_

### token
InfluxDB [authentication token](/{{< latest "influxdb" "v2" >}}/security/tokens/).

_**Data type:** String_

### start
The earliest time to include when calculating cardinality.
The cardinality calculation **includes** points that match the specified start time.
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to [`now()`](/influxdb/v2.0/reference/flux/stdlib/built-in/misc/now/).

_**Data type:** Duration | Time_

### stop
The latest time to include when calculating cardinality.
The cardinality calculation **excludes** points that match the specified start time.
Use a relative duration or absolute time.
For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to [`now()`](/influxdb/v2.0/reference/flux/stdlib/built-in/misc/now/).
Defaults to `now()`.

_**Data type:** Duration | Time_

### predicate
Predicate function that filters records.
_Defaults to `(r) => true`._

_**Data type:** Function_

## Examples

##### Query series cardinality in a bucket
```js
import "influxdata/influxdb"

influxdb.cardinality(
  bucket: "example-bucket",
  start: -1y
)
```

##### Query series cardinality in a measurement
```js
import "influxdata/influxdb"

influxdb.cardinality(
  bucket: "example-bucket",
  start: -1y,
  predicate: (r) => r._measurement == "example-measurement"
)
```

##### Query series cardinality for a specific tag
```js
import "influxdata/influxdb"

influxdb.cardinality(
  bucket: "example-bucket",
  start: -1y,
  predicate: (r) => r.exampleTag == "foo"
)
```
