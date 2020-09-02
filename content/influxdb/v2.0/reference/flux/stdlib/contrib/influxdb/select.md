---
title: influxdb.select() function
description: >
  The `influxdb.select()` function is an alternate implementation of `from()`, `range()`, `filter()`
  and `pivot()` that returns pivoted query results and masks the `_start` and `_stop` column
  Results are similar to those returned by InfluxQL `SELECT` statements.
menu:
  influxdb_2_0_ref:
    name: influxdb.select
    parent: contrib_influxdb
weight: 202
influxdb/v2.0/tags: [functions, package, query]
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/inputs/from/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/range/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/fieldsascols/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/pivot/
---

The `influxdb.select()` function is an alternate implementation of `from()`, `range()`, `filter()`
and `pivot()` that returns pivoted query results and masks the `_measurement`, `_start`, and `_stop` columns.
Results are similar to those returned by InfluxQL `SELECT` statements.

_**Function type:** Input_

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

### from
<span class="req">Required</span> Name of the bucket to query.

_**Data type:** String_

### start
<span class="req">Required</span> Earliest time to include in results.
Results **include** points that match the specified start time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

_**Data type:** Duration | Time | Integer_

### stop
Latest time to include in results.
Results **exclude** points that match the specified stop time.
Use a relative duration, absolute time, or integer (Unix timestamp in seconds).
For example, `-1h`, `2019-08-28T22:00:00Z`, or `1567029600`.
Durations are relative to `now()`.

Defaults to `now()`.

_**Data type:** Duration | Time | Integer_

### m
<span class="req">Required</span> Name of the measurement to query.

_**Data type:** String_

### fields
List of fields to query.
Returns all fields when list is empty or unspecified.
Defaults to `[]`.

_**Data type:** Array of Strings_

### where
A single argument predicate function that evaluates true or false and filters results based on tag values.
Records are passed to the function **before fields are pivoted into columns**.
Records that evaluate to true are included in the output tables.
Records that evaluate to _null_ or false are not included in the output tables.
Defaults to `(r) => true`.

_**Data type:** Function_

{{% note %}}
Records evaluated in `fn` functions are represented by `r`, short for "record" or "row".
{{% /note %}}

### host
URL of the InfluxDB instance to query.
_See [InfluxDB URLs](/influxdb/v2.0/reference/urls/)._

_**Data type:** String_

### org
Organization name.

_**Data type:** String_

### token
InfluxDB [authentication token](/influxdb/v2.0/security/tokens/).

_**Data type:** String_


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

---

{{% note %}}
#### Package author and maintainer
**Github:** [@jsternberg](https://github.com/jsternberg)  
**InfluxDB Slack:** [@Jonathan Sternberg](https://influxdata.com/slack)
{{% /note %}}
