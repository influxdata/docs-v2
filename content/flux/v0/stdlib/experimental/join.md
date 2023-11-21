---
title: experimental.join() function
description: >
  `experimental.join()` joins two streams of tables on the **group key and `_time` column**.
menu:
  flux_v0_ref:
    name: experimental.join
    parent: experimental
    identifier: experimental/join
weight: 101
flux/v0/tags: [transformations]
introduced: 0.65.0
deprecated: 0.172.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L399-L403

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.join()` joins two streams of tables on the **group key and `_time` column**.

{{% warn %}}
#### Deprecated
`experimental.join()` is deprecated in favor of [`join.time()`](/flux/v0/stdlib/join/time/).
The [`join` package](/flux/v0/stdlib/join/) provides support
for multiple join methods.
{{% /warn %}}

Use the `fn` parameter to map new output tables using values from input tables.

**Note**: To join streams of tables with different fields or measurements,
use `group()` or `drop()` to remove `_field` and `_measurement` from the
group key before joining.

##### Function type signature

```js
(fn: (left: A, right: B) => C, left: stream[A], right: stream[B]) => stream[C] where A: Record, B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### left
({{< req >}})
First of two streams of tables to join.



### right
({{< req >}})
Second of two streams of tables to join.



### fn
({{< req >}})
Function with left and right arguments that maps a new output record
using values from the `left` and `right` input records.
The return value must be a record.




## Examples

- [Join two streams of tables](#join-two-streams-of-tables)
- [Join two streams of tables with different fields and measurements](#join-two-streams-of-tables-with-different-fields-and-measurements)

### Join two streams of tables

```js
import "array"
import "experimental"

left =
    array.from(
        rows: [
            {_time: 2021-01-01T00:00:00Z, _field: "temp", _value: 80.1},
            {_time: 2021-01-01T01:00:00Z, _field: "temp", _value: 80.6},
            {_time: 2021-01-01T02:00:00Z, _field: "temp", _value: 79.9},
            {_time: 2021-01-01T03:00:00Z, _field: "temp", _value: 80.1},
        ],
    )
right =
    array.from(
        rows: [
            {_time: 2021-01-01T00:00:00Z, _field: "temp", _value: 75.1},
            {_time: 2021-01-01T01:00:00Z, _field: "temp", _value: 72.6},
            {_time: 2021-01-01T02:00:00Z, _field: "temp", _value: 70.9},
            {_time: 2021-01-01T03:00:00Z, _field: "temp", _value: 71.1},
        ],
    )

experimental.join(
    left: left,
    right: right,
    fn: (left, right) =>
        ({left with lv: left._value, rv: right._value, diff: left._value - right._value}),
)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _field  | _time                | _value  | diff  | lv   | rv   |
| ------- | -------------------- | ------- | ----- | ---- | ---- |
| temp    | 2021-01-01T00:00:00Z | 80.1    | 5     | 80.1 | 75.1 |
| temp    | 2021-01-01T01:00:00Z | 80.6    | 8     | 80.6 | 72.6 |
| temp    | 2021-01-01T02:00:00Z | 79.9    | 9     | 79.9 | 70.9 |
| temp    | 2021-01-01T03:00:00Z | 80.1    | 9     | 80.1 | 71.1 |

{{% /expand %}}
{{< /expand-wrapper >}}

### Join two streams of tables with different fields and measurements

```js
import "experimental"

s1 =
    from(bucket: "example-bucket")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "foo" and r._field == "bar")
        |> group(columns: ["_time", "_measurement", "_field", "_value"], mode: "except")

s2 =
    from(bucket: "example-bucket")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "baz" and r._field == "quz")
        |> group(columns: ["_time", "_measurement", "_field", "_value"], mode: "except")

experimental.join(
    left: s1,
    right: s2,
    fn: (left, right) => ({left with bar_value: left._value, quz_value: right._value}),
)

```

