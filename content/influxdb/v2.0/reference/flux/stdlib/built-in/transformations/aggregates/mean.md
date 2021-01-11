---
title: mean() function
description: The `mean()` function computes the mean or average of non-null records in the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/mean
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/mean/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/mean/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/mean/
menu:
  influxdb_2_0_ref:
    name: mean
    parent: built-in-aggregates
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#mean, InfluxQL – MEAN()
---

The `mean()` function computes the mean or average of non-null records in the input table.

_**Function type:** Aggregate_  
_**Output data type:** Float_

```js
mean(column: "_value")
```

## Parameters

### column
The column to use to compute the mean.
Defaults to `"_value"`.

_**Data type:** String_

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
