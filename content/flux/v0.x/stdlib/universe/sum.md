---
title: sum() function
description: The `sum()` function computes the sum of non-null records in a specified column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/sum
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/sum/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/sum/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/sum/
menu:
  flux_0_x_ref:
    name: sum
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#sum, InfluxQL – SUM()
  - /flux/v0.x/stdlib/experimental/sum
introduced: 0.7.0
---

The `sum()` function computes the sum of non-null records in a specified column.

```js
sum(column: "_value")
```

## Parameters

### column {data-type="string"}
The column on which to operate.
Default is `"_value"`.

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> sum()
```
