---
title: experimental.join() function
description: >
  The `experimental.join()` function joins two streams of tables on the
  group key with the addition of the `_time` column.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/join/
  - /influxdb/cloud/reference/flux/stdlib/experimental/join/
menu:
  flux_0_x_ref:
    name: experimental.join
    parent: experimental
weight: 302
flux/v0.x/tags: [transformations]
introduced: 0.65.0
---

The `experimental.join()` function joins two streams of tables on the
[group key](/influxdb/v2.0/reference/glossary/#group-key) and `_time` column.
Use the [`fn` parameter](#fn) to map new output tables using values from input tables.

{{% note %}}
To join streams of tables with different fields or measurements, use [`group()`](/flux/v0.x/stdlib/universe/group/)
or [`drop()`](/flux/v0.x/stdlib/universe/drop/) to remove
`_field` and `_measurement` from the group key before joining.
_See an example [below](#join-two-streams-of-tables-with-different-fields-and-measurements)._
{{% /note %}}

_**Function type:** Transformation_

```js
import "experimental"

// ...

experimental.join(
  left: left,
  right: right,
  fn: (left, right) => ({left with lv: left._value, rv: right._value })
)
```

## Parameters

### left
First of two streams of tables to join.

_**Data type:** Stream of tables_

### right
Second of two streams of tables to join.

_**Data type:** Stream of tables_

### fn
A function with `left` and `right` arguments that maps a new output record
using values from the `left` and `right` input records.
The return value must be a record.

_**Data type:** Function_

## Examples

### Input and output tables

**Given the following input tables:**
{{< flex >}}
{{% flex-content %}}
##### left
| _time | _field | _value |
|:----- |:------:| ------:|
| 0001  | temp   | 80.1   |
| 0002  | temp   | 80.2   |
| 0003  | temp   | 79.9   |
| 0004  | temp   | 80.0   |
{{% /flex-content %}}
{{% flex-content %}}
##### right
| _time | _field | _value |
|:----- |:------:| ------:|
| 0001  | temp   | 72.1   |
| 0002  | temp   | 72.2   |
| 0003  | temp   | 71.9   |
| 0004  | temp   | 72.0   |
{{% /flex-content %}}
{{< /flex >}}

**The following `experimental.join()` function would output:**

```js
import "experimental"

experimental.join(
  left: left,
  right: right,
  fn: (left, right) => ({
    left with
    lv: left._value,
    rv: right._value,
    diff: left._value - right._value
  })
)
```

| _time | _field | lv   | rv   | diff |
|:----- |:------:|:--:  |:--:  | ----:|
| 0001  | temp   | 80.1 | 72.1 | 8.0  |
| 0002  | temp   | 80.2 | 72.2 | 8.0  |
| 0003  | temp   | 79.9 | 71.9 | 8.0  |
| 0004  | temp   | 80.0 | 72.0 | 8.0  |

---

###### Join two streams of tables
```js
import "experimental"

s1 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "foo")

s2 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "bar")

experimental.join(
  left: s1,
  right: s2,
  fn: (left, right) => ({
    left with
    s1_value: left._value,
    s2_value: right._value
  })
)
```

###### Join two streams of tables with different fields and measurements
```js
import "experimental"

s1 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "foo" and r._field == "bar")
  |> group(columns: ["_time", "_measurement", "_field", "_value"], mode: "except")

s2 = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "baz" and r._field == "quz")
  |> group(columns: ["_time", "_measurement", "_field", "_value"], mode: "except")

experimental.join(
  left: s1,
  right: s2,
  fn: (left, right) => ({
    left with
    bar_value: left._value,
    quz_value: right._value
  })
)
```
