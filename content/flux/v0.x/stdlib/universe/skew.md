---
title: skew() function
description: The `skew()` function outputs the skew of non-null records as a float.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/skew
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/skew/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/skew/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/skew/
menu:
  flux_0_x_ref:
    name: skew
    parent: universe
weight: 102
related:
  - /flux/v0.x/experimental/skew/
flux/v0.x/tags: [aggregates, transformations]
introduced: 0.7.0
---

The `skew()` function outputs the skew of non-null records as a float.

_**Output data type:** Float_

```js
skew(column: "_value")
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
  |> skew()
```
