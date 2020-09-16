---
title: max() function
description: The `max()` function selects record with the highest _value from the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/max  
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/max/
menu:
  influxdb_2_0_ref:
    name: max
    parent: built-in-selectors
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#max, InfluxQL – MAX()
---

The `max()` function selects record with the highest `_value` from the input table.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
max(column: "_value")
```

{{% warn %}}
#### Empty tables
`max()` drops empty tables.
{{% /warn %}}

## Parameters

### column
The column to use to calculate the maximum value.
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
  |> max()
```
