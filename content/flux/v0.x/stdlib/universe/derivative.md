---
title: derivative() function
description: The `derivative()` function computes the rate of change per unit of time between subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/derivative
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/derivative/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/derivative/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/derivative/
menu:
  flux_0_x_ref:
    name: derivative
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/rate/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#derivative, InfluxQL – DERIVATIVE()
introduced: 0.7.0
---

The `derivative()` function computes the rate of change per [`unit`](#unit) of time between subsequent non-null records.
It assumes rows are ordered by the `_time` column.
The output table schema is the same as the input table.
 
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

### unit {data-type="duration"}
The time duration used when creating the derivative.
Defaults to `1s`.

### nonNegative {data-type="bool"}
Indicates if the derivative is allowed to be negative. Default is `true`.
When `true`, if a value is less than the previous value, it is assumed the
previous value should have been a zero.

### columns {data-type="string"}
The columns to use to compute the derivative.
Defaults to `["_value"]`.

### timeColumn {data-type="string"}
The column containing time values.
Defaults to `"_time"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Output tables
For each input table with `n` rows, `derivative()` outputs a table with `n - 1` rows.

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> derivative(unit: 1s, nonNegative: true)
```
