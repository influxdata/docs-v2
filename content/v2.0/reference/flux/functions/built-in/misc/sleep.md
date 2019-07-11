---
title: sleep() function
description: The `sleep()` function delays execution by a specified duration.
menu:
  v2_0_ref:
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
The pipe parameter that defines input tables.

_**Data type:** Object_

### duration
The amount of time execution should be delayed.

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
