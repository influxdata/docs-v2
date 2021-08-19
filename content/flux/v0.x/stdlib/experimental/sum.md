---
title: experimental.sum() function
description: The `experimental.sum()` function computes the sum of non-null records in a specified column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/sum
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/sum/
menu:
  flux_0_x_ref:
    name: experimental.sum
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/sum/
  - /influxdb/cloud/reference/flux/stdlib/experimental/sum/
related:
  - /flux/v0.x/stdlib/universe/sum/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#sum, InfluxQL – SUM()
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.107.0
---

The `experimental.sum()` function computes the sum of non-null values in the `_value`
column for each input table.

```js
import "experimental"

experimental.sum()
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
  |> experimental.sum()
```
