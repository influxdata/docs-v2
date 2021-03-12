---
title: derivative() function
description: The `derivative()` function computes the rate of change per unit of time between subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/derivative
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/derivative/
menu:
  influxdb_2_0_ref:
    name: derivative
    parent: built-in-transformations
weight: 402
related:
  - /influxdb/v2.0/query-data/flux/rate/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#derivative, InfluxQL – DERIVATIVE()
---

The `derivative()` function computes the rate of change per [`unit`](#unit) of time between subsequent non-null records.
It assumes rows are ordered by the `_time` column.
The output table schema is the same as the input table.

_**Function type:** Transformation_  
_**Output data type:** Float_

```js
derivative(
  unit: 1s,
  nonNegative: true,
  columns: ["_value"],
  timeColumn: "_time"
)
```

## Parameters

### unit
The time duration used when creating the derivative.
Defaults to `1s`.

_**Data type:** Duration_

### nonNegative
Indicates if the derivative is allowed to be negative. Default is `true`.
When `true`, if a value is less than the previous value, it is assumed the
previous value should have been a zero.

_**Data type:** Boolean_

### columns
The columns to use to compute the derivative.
Defaults to `["_value"]`.

_**Data type:** String_

### timeColumn
The column containing time values.
Defaults to `"_time"`.

_**Data type:** String_

## Output tables
For each input table with `n` rows, `derivative()` outputs a table with `n - 1` rows.

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> derivative(unit: 1s, nonNegative: true)
```
