---
title: mean() function
description: The `mean()` function computes the mean or average of non-null records in the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/mean
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/mean/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/mean/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/mean/
menu:
  flux_0_x_ref:
    name: mean
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#mean, InfluxQL – MEAN()
  - /flux/v0.x/stdlib/experimental/mean/
introduced: 0.7.0
---

The `mean()` function computes the mean or average of non-null records in the input table.

_**Output data type:** Float_

```js
mean(column: "_value")
```

## Parameters

### column {data-type="string"}
Column to use to compute the mean.
Default is `"_value"`.

## Examples
```js
from(bucket:"example-bucket")
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent")
  |> range(start:-12h)
  |> window(every:10m)
  |> mean()
```
