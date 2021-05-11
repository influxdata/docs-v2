---
title: sleep() function
description: The `sleep()` function delays execution by a specified duration.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/sleep/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/sleep/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/sleep/
menu:
  flux_0_x_ref:
    name: sleep
    parent: universe
weight: 102
introduced: 0.36.0
---

The `sleep()` function delays execution by a specified duration.

```js
sleep(
  v: x,
  duration: 10s
)
```

## Parameters

### v {data-type="stream of tables"}
Input tables.
`sleep()` accepts piped-forward data and passes it on unmodified after the
specified [duration](#duration).
If data is not piped-forward into `sleep()`, set `v` to specify a stream of tables.
The examples [below](#examples) illustrate how.

### duration {data-type="duration"}
Length of time to delay execution.

## Examples

### Delay execution in a chained query
```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> sleep(duration: 10s)
```

### Delay execution using a stream variable
```js
x = from(bucket: "example-bucket")
    |> range(start: -1h)

sleep(v: x, duration: 10s)
```
