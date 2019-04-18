---
title: max() function
description: The `max()` function selects record with the highest _value from the input table.
aliases:
  - /v2.0/reference/flux/functions/transformations/selectors/max
menu:
  v2_0_ref:
    name: max
    parent: built-in-selectors
weight: 501
---

The `max()` function selects record with the highest `_value` from the input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
max(column: "_value")
```

## Parameters

### column
The column to use to calculate the maximum value.
Default is `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> max()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[MAX()](https://docs.influxdata.com/influxdb/latest/query_language/functions/#max)  
