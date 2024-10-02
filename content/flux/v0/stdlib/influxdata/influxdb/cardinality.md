---
title: influxdb.cardinality() function
description: >
  `influxdb.cardinality()` returns the series cardinality of data retrieved from InfluxDB.
menu:
  flux_v0_ref:
    name: influxdb.cardinality
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/cardinality
weight: 201
flux/v0/tags: [metadata]
introduced: 0.92.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/influxdb.flux#L75-L88

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`influxdb.cardinality()` returns the series cardinality of data retrieved from InfluxDB.


{{% note %}}
Although this function is similar to InfluxQL's [`SHOW SERIES CARDINALITY`](/influxdb/v1/query_language/spec/#show-series-cardinality),
it works in a slightly different manner.

`influxdb.cardinality()` is time bounded and reports the cardinality of data that matches the conditions passed into it rather than that of the bucket as a whole.
{{% /note %}}


##### Function type signature

```js
(
    start: A,
    ?bucket: string,
    ?bucketID: string,
    ?host: string,
    ?org: string,
    ?orgID: string,
    ?predicate: (r: {B with _value: C, _measurement: string, _field: string}) => bool,
    ?stop: D,
    ?token: string,
) => stream[{_value: int, _stop: time, _start: time}] where A: Timeable, D: Timeable
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bucket

Bucket to query cardinality from.



### bucketID

String-encoded bucket ID to query cardinality from.



### org

Organization name.



### orgID

String-encoded organization ID.



### host

URL of the InfluxDB instance to query.

See [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)
or [InfluxDB OSS URLs](/influxdb/latest/reference/urls/).

### token

InfluxDB API token.



### start
({{< req >}})
Earliest time to include when calculating cardinality.

The cardinality calculation includes points that match the specified start time.
Use a relative duration or absolute time. For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to `now()`.

### stop

Latest time to include when calculating cardinality.

The cardinality calculation excludes points that match the specified start time.
Use a relative duration or absolute time. For example, `-1h` or `2019-08-28T22:00:00Z`.
Durations are relative to `now()`. Default is `now()`.

{{% note %}}
The default value is `now()`, so any points that have been written into the future will
not be counted unless a future `stop` date is provided.
{{% /note %}}


### predicate

Predicate function that filters records.
Default is `(r) => true`.




## Examples

- [Query series cardinality in a bucket](#query-series-cardinality-in-a-bucket)
- [Query series cardinality in a measurement//](#query-series-cardinality-in-a-measurement)
- [Query series cardinality for a specific tag](#query-series-cardinality-for-a-specific-tag)

### Query series cardinality in a bucket

```js
import "influxdata/influxdb"

influxdb.cardinality(bucket: "example-bucket", start: time(v: 1))

```
Note: if points have been written into the future, you will need to add an appropriate `stop` date


### Query series cardinality in a measurement//

```js
import "influxdata/influxdb"

influxdb.cardinality(
    bucket: "example-bucket",
    start: time(v: 1),
    predicate: (r) => r._measurement == "example-measurement",
)

```


### Query series cardinality for a specific tag

```js
import "influxdata/influxdb"

influxdb.cardinality(bucket: "example-bucket", start: time(v: 1), predicate: (r) => r.exampleTag == "foo")

```

