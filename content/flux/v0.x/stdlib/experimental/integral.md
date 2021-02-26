---
title: experimental.integral() function
description: >
  The `integral()` function computes the area under the curve per unit of time of subsequent non-null records.
  Input tables must have `_time` and `_value` columns.
menu:
  flux_0_x_ref:
    name: experimental.integral
    parent: experimental
weight: 302
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#integral, InfluxQL – INTEGRAL()
  - /flux/v0.x/stdlib/universe/integral/
flux/v0.x/tags: [transformations, aggregates]
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
Time duration used to compute the integral.

_**Data type:** Duration_

### interpolate
Type of interpolation to use.
Defaults to `""`.

Use one of the following interpolation options:

- _empty string for no interpolation_
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
