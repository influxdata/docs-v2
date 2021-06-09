---
title: today() function
description: >
  The `today()` function returns the `now()` timestamp truncated to the day unit.
menu:
  influxdb_2_0_ref:
    name: today
    parent: built-in-misc
weight: 401
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/now/
  - /influxdb/v2.0/reference/flux/stdlib/date/truncate/
  - /influxdb/v2.0/reference/flux/stdlib/system/time/
influxdb/v2.0/tags: [date/time]
introduced: 0.116.0
---

The `today()` function returns the `now()` timestamp truncated to the day unit.

_**Function type:** Date/Time_  
_**Output data type:** Time_

```js
today()
```

## Examples

##### Return a timestamp representing today
```js
option now = () => 2021-01-01T13:45:28Z

today()
// Returns 2021-01-01T00:00:00.000000000Z
```

##### Query data from today
```js
from(bucket: "example-bucket")
  |> range(start: today())
```
