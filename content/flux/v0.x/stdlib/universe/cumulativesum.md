---
title: cumulativeSum() function
description: The `cumulativeSum()` function computes a running sum for non-null records in the table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/cumulativesum
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/cumulativesum/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/cumulativesum/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/cumulativesum/
menu:
  flux_0_x_ref:
    name: cumulativeSum
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/cumulativesum/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#cumulative-sum, InfluxQL – CUMULATIVE_SUM()
introduced: 0.7.0
---

The `cumulativeSum()` function computes a running sum for non-null records in the table.
The output table schema will be the same as the input table.

_**Output data type:** Float_

```js
cumulativeSum(columns: ["_value"])
```

## Parameters

### columns {data-type="array of strings"}
A list of columns on which to operate.
Defaults to `["_value"]`.

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> filter(fn: (r) =>
    r._measurement == "disk" and
    r._field == "used_percent"
  )
  |> cumulativeSum(columns: ["_value"])
```
