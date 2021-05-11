---
title: max() function
description: The `max()` function selects record with the highest _value from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/max  
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/max/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/max/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/max/
menu:
  flux_0_x_ref:
    name: max
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#max, InfluxQL – MAX()
introduced: 0.7.0
---

The `max()` function selects record with the highest `_value` from the input table.

```js
max(column: "_value")
```

{{% warn %}}
#### Empty tables
`max()` drops empty tables.
{{% /warn %}}

## Parameters

### column {data-type="string"}
The column to use to calculate the maximum value.
Default is `"_value"`.

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> max()
```
