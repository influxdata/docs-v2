---
title: max() function
description: The max() function selects record with the highest _value from the input table.
menu:
  v2_0_ref:
    name: max
    parent: Selectors
weight: 401
---

The `max()` function selects record with the highest `_value` from the input table.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
max()
```

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
