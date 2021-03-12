---
title: time() function
description: The `time()` function converts a single value to a time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/time/
menu:
  influxdb_2_0_ref:
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

_**Data type:** Integer | String | Uinteger_

{{% note %}}
`time()` assumes all numeric input values are nanosecond epoch timestamps.
{{% /note %}}

## Examples
```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "system" )
  |> map(fn:(r) => ({ r with timestamp: time(v: r.timestamp) }))
```
