---
title: duration() function
description: The duration() function converts a value to a duration.
menu:
  v2_0_ref:
    name: duration
    parent: built-in-type-conversions
weight: 502
---

The `duration()` function converts a single value to a duration.

_**Function type:** Type conversion_  
_**Output data type:** Duration_

```js
duration(v: "1m")
```

## Parameters

### v
The value to convert.

## Examples
```js
from(bucket: "sensor-data")
  |> filter(fn:(r) =>
    r._measurement == "system" and
  )
  |> map(fn:(r) => duration(v: r.uptime))
```
