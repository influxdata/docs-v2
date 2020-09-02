---
title: integral() function
description: The `integral()` function computes the area under the curve per unit of time of subsequent non-null records.
aliases:
  - /v2.0/reference/flux/functions/transformations/aggregates/integral
  - /v2.0/reference/flux/functions/built-in/transformations/aggregates/integral/
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
integral(unit: 10s, column: "_value")
```

## Parameters

### unit
The time duration used when computing the integral.

_**Data type:** Duration_

### column
The column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> integral(unit:10s)
```
