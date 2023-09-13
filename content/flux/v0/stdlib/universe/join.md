---
title: join() function
description: >
  `join()` merges two streams of tables into a single output stream based on columns with equal values.
  Null values are not considered equal when comparing column values.
  The resulting schema is the union of the input schemas.
  The resulting group key is the union of the input group keys.
menu:
  flux_v0_ref:
    name: join
    parent: universe
    identifier: universe/join
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.7.0
deprecated: 0.172.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1184-L1184

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`join()` merges two streams of tables into a single output stream based on columns with equal values.
Null values are not considered equal when comparing column values.
The resulting schema is the union of the input schemas.
The resulting group key is the union of the input group keys.

{{% warn %}}
#### Deprecated
`join()` is deprecated in favor of [`join.inner()`](/flux/v0/stdlib/join/inner/).
The [`join` package](/flux/v0/stdlib/join/) provides support
for multiple join methods.
{{% /warn %}}

#### Output data
The schema and group keys of the joined output output data is the union of
the input schemas and group keys.
Columns that exist in both input streams that are not part specified as
columns to join on are renamed using the pattern `<column>_<table>` to
prevent ambiguity in joined tables.

### Join vs union
`join()` creates new rows based on common values in one or more specified columns.
Output rows also contain the differing values from each of the joined streams.
`union()` does not modify data in rows, but unions separate streams of tables
into a single stream of tables and groups rows of data based on existing group keys.

##### Function type signature

```js
(<-tables: A, ?method: string, ?on: [string]) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Record containing two input streams to join.



### on

List of columns to join on.



### method

Join method. Default is `inner`.

**Supported methods**:
- inner


## Examples

- [Join two streams of tables](#join-two-streams-of-tables)
- [Join data from separate data sources](#join-data-from-separate-data-sources)

### Join two streams of tables

```js
import "generate"

t1 =
    generate.from(
        count: 4,
        fn: (n) => n + 1,
        start: 2021-01-01T00:00:00Z,
        stop: 2021-01-05T00:00:00Z,
    )
        |> set(key: "tag", value: "foo")

t2 =
    generate.from(
        count: 4,
        fn: (n) => n * (-1),
        start: 2021-01-01T00:00:00Z,
        stop: 2021-01-05T00:00:00Z,
    )
        |> set(key: "tag", value: "foo")

join(tables: {t1: t1, t2: t2}, on: ["_time", "tag"])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _time                | _value_t1  | _value_t2  | tag  |
| -------------------- | ---------- | ---------- | ---- |
| 2021-01-01T00:00:00Z | 1          | 0          | foo  |
| 2021-01-02T00:00:00Z | 2          | -1         | foo  |
| 2021-01-03T00:00:00Z | 3          | -2         | foo  |
| 2021-01-04T00:00:00Z | 4          | -3         | foo  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Join data from separate data sources

```js
import "sql"

sqlData =
    sql.from(
        driverName: "postgres",
        dataSourceName: "postgresql://username:password@localhost:5432",
        query: "SELECT * FROM example_table",
    )

tsData =
    from(bucket: "example-bucket")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "example-measurement")
        |> filter(fn: (r) => exists r.sensorID)

join(tables: {sql: sqlData, ts: tsData}, on: ["_time", "sensorID"])

```

