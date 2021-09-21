---
title: influxdb.select() function
description: >
  The `influxdb.select()` function is an alternate implementation of `from()`, `range()`, `filter()`
  and `pivot()` that returns pivoted query results and masks the `_start` and `_stop` column
  Results are similar to those returned by InfluxQL `SELECT` statements.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/influxdb/select/
  - /influxdb/cloud/reference/flux/stdlib/contrib/influxdb/select/
menu:
  flux_0_x_ref:
    name: influxdb.select
    parent: contrib_influxdb
weight: 301
flux/v0.x/tags: [inputs]
related:
  - /flux/v0.x/stdlib/influxdata/influxdb/from/
  - /flux/v0.x/stdlib/universe/range/
  - /flux/v0.x/stdlib/universe/filter/
  - /flux/v0.x/stdlib/influxdata/influxdb/schema/fieldsascols/
  - /flux/v0.x/stdlib/universe/pivot/
introduced: 0.77.0
---

The `influxdb.select()` function is an alternate implementation of `from()`, `range()`, `filter()`
and `pivot()` that returns pivoted query results and masks the `_measurement`, `_start`, and `_stop` columns.
Results are similar to those returned by InfluxQL `SELECT` statements.

```js
import "contrib/jsternberg/influxdb"

influxdb.select(
  from: "example-bucket",
  start: -1d,
  stop: now(),
  m: "example-measurement",
  fields: [],
  where: (r) => true,
  host: "https://example.com",
  org: "example-org",
  token: "MySuP3rSecr3Tt0k3n"
)
```

## Parameters

{{% note %}}
[host](#host), [org](#org), and [token](#token) parameters are only required when
querying data from a **different organization** or a **remote InfluxDB instance**.
{{% /note %}}

### from {data-type="string"}
({{< req >}}) Name of the bucket to query.

### start {data-type="duration, time, int"}
({{< req >}}) Earliest time to include in results.
Results **include** points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

### stop {data-type="duration, time, int"}
Latest time to include in results.
Results **exclude** points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

Defaults to `now()`.

### m {data-type="string"}
({{< req >}}) Name of the measurement to query.

### fields {data-type="array of strings"}
List of fields to query.
Returns all fields when list is empty or unspecified.
Defaults to `[]`.

### where {data-type="function"}
A single argument predicate function that evaluates true or false and filters results based on tag values.
Records are passed to the function **before fields are pivoted into columns**.
Records that evaluate to true are included in the output tables.
Records that evaluate to _null_ or false are not included in the output tables.
Defaults to `(r) => true`.

{{% note %}}
Records evaluated in `fn` functions are represented by `r`, short for "record" or "row".
{{% /note %}}

### host {data-type="string"}
URL of the InfluxDB instance to query.
_See [InfluxDB URLs](/{{< latest "influxdb" >}}/reference/urls/)
or [InfluxDB Cloud regions](/{{< latest "influxdb" >}}/reference/regions/)._

### org {data-type="string"}
Organization name.

### token {data-type="string"}
InfluxDB [API token](/{{< latest "influxdb" >}}/security/tokens/).

## Examples

- [Query a single field](#query-a-single-field)
- [Query multiple fields](#query-multiple-fields)
- [Query all fields and filter by tags](#query-all-fields-and-filter-by-tags)
- [Query data from a remote InfluxDB Cloud instance](#query-data-from-a-remote-influxdb-cloud-instance)

##### Query a single field
```js
import "contrib/jsternberg/influxdb"

influxdb.select(
  from: "example-bucket",
  start: -1d,
  m: "example-measurement",
  fields: ["field1"]
)
```

##### Query multiple fields
```js
import "contrib/jsternberg/influxdb"

influxdb.select(
  from: "example-bucket",
  start: -1d,
  m: "example-measurement",
  fields: ["field1", "field2", "field3"]
)
```

##### Query all fields and filter by tags
```js
import "contrib/jsternberg/influxdb"

influxdb.select(
  from: "example-bucket",
  start: -1d,
  m: "example-measurement",
  where: (r) => r.host == "host1" and r.region == "us-west"
)
```

##### Query data from a remote InfluxDB Cloud instance
```js
import "contrib/jsternberg/influxdb"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "INFLUXDB_CLOUD_TOKEN")

influxdb.select(
  from: "example-bucket",
  start: -1d,
  m: "example-measurement",
  fields: ["field1", "field2"],
  host: "https://cloud2.influxdata.com",
  org: "example-org",
  token: token
)
```
