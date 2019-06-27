---
title: time() function
description: The `time()` function converts a single value to a time.
menu:
  v2_0_ref:
    name: time
    parent: built-in-type-conversions
weight: 502
---

The `time()` function converts a single value to a time.

_**Function type:** Type conversion_  
_**Output data type:** Time_

```js
time(v: "2016-06-13T17:43:50.1004002Z")
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
  |> map(fn:(r) => ({ r with timestamp: time(v: r.timestamp) }))
```
