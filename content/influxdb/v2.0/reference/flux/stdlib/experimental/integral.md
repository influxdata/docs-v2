---
title: experimental.integral() function
description: >
  The `integral()` function computes the area under the curve per unit of time of subsequent non-null records.
  Input tables must have `_time` and `_value` columns.
menu:
  influxdb_2_0_ref:
    name: experimental.integral
    parent: Experimental
weight: 302
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#integral, InfluxQL – INTEGRAL()
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/integral/
introduced: 0.106.0
---

The `experimental.integral()` function computes the area under the curve per
[`unit`](#unit) of time of subsequent non-null records.
The curve is defined using `_time` as the domain and record values as the range.
**Input tables must have `_time` and `_value` columns.**

```js
integral(
  unit: 10s,
  interpolate: ""
)
```

## Parameters

### unit
({{< req >}})
Time duration used when computing the integral.

_**Data type:** Duration_

### interpolate
Type of interpolation to use.
Defaults to `""`.

Use one of the following interpolation options:

- _empty sting for no interpolation_
- linear

_**Data type:** String_

## Examples

##### Calculate the integral
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> integral(unit:10s)
```

##### Calculate the integral with linear interpolation
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> integral(unit:10s, interpolate: "linear")
```
