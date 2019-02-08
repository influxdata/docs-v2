---
title: min() function
description: The min() function selects record with the lowest _value from the input table.
aliases:
  - /v2.0/reference/flux/functions/transformations/selectors/min
menu:
  v2_0_ref:
    name: min
    parent: built-in-selectors
weight: 501
---

The `min()` function selects record with the lowest `_value` from the input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
min()
```

## Examples
```js
from(bucket:"telegraf/autogen")
  |> range(start:-1h)
  |> filter(fn: (r) =>
    r._measurement == "cpu" and
    r._field == "usage_system"
  )
  |> min()
```

<hr style="margin-top:4rem"/>

##### Related InfluxQL functions and statements:
[MIN()](https://docs.influxdata.com/influxdb/latest/query_language/functions/#min)  
