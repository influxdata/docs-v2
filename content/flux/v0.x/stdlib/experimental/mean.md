---
title: experimental.mean() function
description: >
  The `experimental.mean()` function computes the mean or average of non-null
  values in the `_value` column of each input table.
menu:
  flux_0_x_ref:
    name: experimental.mean
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/experimental/mean
  - /influxdb/cloud/reference/flux/experimental/mean
related:
  - /flux/v0.x/stdlib/universe/mean
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#mean, InfluxQL – MEAN()
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.107.0
---

The `experimental.mean()` function computes the mean or average of non-null
values in the `_value` column of each input table.
Output tables contain a single row the with the calculated mean in the `_value` column.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
import "experimental"

experimental.mean()
```

## Examples
```js
import "experimental"

from(bucket:"example-bucket")
  |> filter(fn: (r) =>
    r._measurement == "example-measurement" and
    r._field == "example-field")
  |> range(start:-1h)
  |> experimental.mean()
```
