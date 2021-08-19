---
title: min() function
description: The `min()` function selects record with the lowest _value from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/min
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/min/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/min/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/min/
menu:
  flux_0_x_ref:
    name: min
    parent: universe
weight: 102
flux/v0.x/tags: [selectors, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#min, InfluxQL – MIN()
introduced: 0.7.0
---

The `min()` function selects record with the lowest `_value` from the input table.

```js
min(column: "_value")
```

{{% warn %}}
#### Empty tables
`min()` drops empty tables.
{{% /warn %}}

## Parameters

### column {data-type="string"}
The column to use to calculate the minimum value.
Default is `"_value"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
from(bucket:"example-bucket")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> min()
```
