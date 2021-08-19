---
title: experimental.spread() function
description: >
  The `experimental.spread()` function outputs the difference between the minimum
  and maximum values in the `_value` column for each input table.
menu:
  flux_0_x_ref:
    name: experimental.spread
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/spread/
  - /influxdb/cloud/reference/flux/stdlib/experimental/spread/
related:
  - /flux/v0.x/stdlib/universe/spread/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#spread, InfluxQL – SPREAD()
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.107.0
---

The `experimental.spread()` function outputs the difference between the minimum
and maximum values in the `_value` column for each input table.
The function supports `uint`, `int`, and `float` values.
The output value type depends on the input value type:

- `uint` or `int` input values return `int` values
- `float` input values return float values

```js
import "experimental"

experimental.spread()
```

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

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
