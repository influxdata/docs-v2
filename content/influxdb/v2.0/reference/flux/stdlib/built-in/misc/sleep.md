---
title: sleep() function
description: The `sleep()` function delays execution by a specified duration.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/sleep/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/sleep/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/sleep/
menu:
  influxdb_2_0_ref:
    name: sleep
    parent: built-in-misc
weight: 401
---

The `sleep()` function delays execution by a specified duration.

_**Function type:** Miscellaneous_

```js
sleep(
  v: x,
  duration: 10s
)
```

## Parameters

### v
Defines input tables.
`sleep()` accepts piped-forward data and passes it on unmodified after the
specified [duration](#duration).
If data is not piped-forward into `sleep()`, set `v` to specify a stream of tables.
The examples [below](#examples) illustrate how.

_**Data type:** Record_

### duration
The length of time to delay execution.

_**Data type:** Duration_

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
