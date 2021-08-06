---
title: time() function
description: The `time()` function converts a single value to a time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/time/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/time/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/time/
menu:
  flux_0_x_ref:
    name: time
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
related:
  - /flux/v0.x/data-types/basic/time/
  - /flux/v0.x/stdlib/universe/totime/
introduced: 0.7.0
---

The `time()` function converts a single value to a time.

_**Output data type:** Time_

```js
time(v: "2016-06-13T17:43:50.1004002Z")
```

## Parameters

### v {data-type="string, int, uint"}
The value to convert.

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
