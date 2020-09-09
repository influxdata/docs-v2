---
title: integral() function
description: The `integral()` function computes the area under the curve per unit of time of subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/integral
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/integral/
menu:
  influxdb_2_0_ref:
    name: integral
    parent: built-in-aggregates
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#integral, InfluxQL – INTEGRAL()
---

The `integral()` function computes the area under the curve per [`unit`](#unit) of time of subsequent non-null records.
The curve is defined using `_time` as the domain and record values as the range.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
integral(
  unit: 10s,
  column: "_value",
  timeColumn: "_time",
  interpolation: ""
)
```

## Parameters

### unit
Time duration used when computing the integral.

_**Data type:** Duration_

### column
Column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

### timeColumn
Column that contains time values to use in the operation.
Defaults to `"_time"`.

_**Data type:** String_

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
