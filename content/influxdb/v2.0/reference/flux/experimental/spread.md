---
title: experimental.spread() function
description: >
  The `experimental.spread()` function outputs the difference between the minimum
  and maximum values in the `_value` column for each input table.
menu:
  influxdb_2_0_ref:
    name: experimental.spread
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/spread/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#spread, InfluxQL – SPREAD()
---

The `experimental.spread()` function outputs the difference between the minimum
and maximum values in the `_value` column for each input table.
The function supports `uint`, `int`, and `float` values.
The output value type depends on the input value type:

- `uint` or `int` input values return `int` values
- `float` input values return float values

_**Function type:** Aggregate_  
_**Output data type:** Integer or Float_

```js
import "experimental"

experimental.spread()
```

## Examples
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field"
  )
  |> experimental.spread()
```
