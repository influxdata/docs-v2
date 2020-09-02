---
title: duration() function
description: The `duration()` function converts a single value to a duration.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/duration/
menu:
  influxdb_2_0_ref:
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

_**Data type:** Integer | String | Uinteger_

{{% note %}}
`duration()` assumes **numeric** input values are **nanoseconds**.
**String** input values must use [duration literal representation](/influxdb/v2.0/reference/flux/language/lexical-elements/#duration-literals).
{{% /note %}}

## Examples

{{% note %}}
Flux does not support duration column types.
The example below converts an integer to a duration and stores the value as a string.
{{% /note %}}

```js
from(bucket: "sensor-data")
  |> range(start: -1m)
  |> filter(fn:(r) => r._measurement == "system" )
  |> map(fn:(r) => ({ r with uptime: string(v: duration(v: r.uptime)) }))
```
