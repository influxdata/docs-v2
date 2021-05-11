---
title: integral() function
description: The `integral()` function computes the area under the curve per unit of time of subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/integral
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/integral/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/integral/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/integral/
menu:
  flux_0_x_ref:
    name: integral
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#integral, InfluxQL – INTEGRAL()
  - /flux/v0.x/stdlib/experimental/integral/
introduced: 0.7.0
---

The `integral()` function computes the area under the curve per [`unit`](#unit) of time of subsequent non-null records.
The curve is defined using `_time` as the domain and record values as the range.

_**Output data type:** Float_

```js
integral(
  unit: 10s,
  column: "_value",
  timeColumn: "_time",
  interpolate: ""
)
```

## Parameters

### unit {data-type="duration"}
({{< req >}})
Time duration used when computing the integral.

### column {data-type="string"}
Column on which to operate.
Defaults to `"_value"`.

### timeColumn {data-type="string"}
Column that contains time values to use in the operation.
Defaults to `"_time"`.

### interpolate {data-type="string"}
Type of interpolation to use.
Defaults to `""`.

Use one of the following interpolation options:

- _empty sting for no interpolation_
- linear

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
