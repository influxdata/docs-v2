---
title: min() function
description: The `min()` function selects record with the lowest _value from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/min
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/min/
menu:
  influxdb_2_0_ref:
    name: min
    parent: built-in-selectors
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#min, InfluxQL – MIN()
---

The `min()` function selects record with the lowest `_value` from the input table.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
min(column: "_value")
```

{{% warn %}}
#### Empty tables
`min()` drops empty tables.
{{% /warn %}}

## Parameters

### column
The column to use to calculate the minimum value.
Default is `"_value"`.

_**Data type:** String_

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
