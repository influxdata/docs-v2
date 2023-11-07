---
title: influxdb.select() function
description: >
  `influxdb.select()` is an alternate implementation of `from()`,
  `range()`, `filter()` and `pivot()` that returns pivoted query results and masks
  the `_measurement`, `_start`, and `_stop` columns. Results are similar to those
  returned by InfluxQL `SELECT` statements.
menu:
  flux_v0_ref:
    name: influxdb.select
    parent: contrib/jsternberg/influxdb
    identifier: contrib/jsternberg/influxdb/select
weight: 301
flux/v0/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/jsternberg/influxdb/influxdb.flux#L215-L267

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`influxdb.select()` is an alternate implementation of `from()`,
`range()`, `filter()` and `pivot()` that returns pivoted query results and masks
the `_measurement`, `_start`, and `_stop` columns. Results are similar to those
returned by InfluxQL `SELECT` statements.



##### Function type signature

```js
(
    from: string,
    m: A,
    start: B,
    ?fields: [string],
    ?host: string,
    ?org: string,
    ?stop: C,
    ?token: string,
    ?where: (
        r: {
            D with
            _value: E,
            _time: time,
            _stop: time,
            _start: time,
            _measurement: string,
            _field: string,
        },
    ) => bool,
) => stream[F] where A: Equatable, F: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### from
({{< req >}})
Name of the bucket to query.



### start
({{< req >}})
Earliest time to include in results.

Results include points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### stop

Latest time to include in results. Default is `now()`.

Results exclude points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### m
({{< req >}})
Name of the measurement to query.



### fields

List of fields to query. Default is`[]`.

_Returns all fields when list is empty or unspecified._

### where

Single argument predicate function that evaluates `true` or `false`
and filters results based on tag values.
Default is `(r) => true`.

Records are passed to the function before fields are pivoted into columns.
Records that evaluate to `true` are included in the output tables.
Records that evaluate to _null_ or `false` are not included in the output tables.

### host

URL of the InfluxDB instance to query.

See [InfluxDB OSS URLs](/influxdb/latest/reference/urls/)
or [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/).

### org

Organization name.



### token

InfluxDB [API token](/influxdb/latest/security/tokens/).




## Examples

- [Query a single field](#query-a-single-field)
- [Query multiple fields](#query-multiple-fields)
- [Query all fields and filter by tags](#query-all-fields-and-filter-by-tags)
- [Query data from a remote InfluxDB Cloud instance](#query-data-from-a-remote-influxdb-cloud-instance)

### Query a single field

```js
import "contrib/jsternberg/influxdb"

influxdb.select(from: "example-bucket", start: -1d, m: "example-measurement", fields: ["field1"])

```


### Query multiple fields

```js
import "contrib/jsternberg/influxdb"

influxdb.select(
    from: "example-bucket",
    start: -1d,
    m: "example-measurement",
    fields: ["field1", "field2", "field3"],
)

```


### Query all fields and filter by tags

```js
import "contrib/jsternberg/influxdb"

influxdb.select(
    from: "example-bucket",
    start: -1d,
    m: "example-measurement",
    where: (r) => r.host == "host1" and r.region == "us-west",
)

```


### Query data from a remote InfluxDB Cloud instance

```js
import "contrib/jsternberg/influxdb"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUXDB_CLOUD_TOKEN")

influxdb.select(
    from: "example-bucket",
    start: -1d,
    m: "example-measurement",
    fields: ["field1", "field2"],
    host: "https://us-west-2-1.aws.cloud2.influxdata.com",
    org: "example-org",
    token: token,
)

```

