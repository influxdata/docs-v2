---
title: today() function
description: >
  The `today()` function returns the `now()` timestamp truncated to the day unit.
menu:
  flux_0_x_ref:
    name: today
    parent: universe
weight: 401
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/today/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/today/
related:
  - /flux/v0.x/stdlib/universe/now/
  - /flux/v0.x/stdlib/date/truncate/
  - /flux/v0.x/stdlib/system/time/
flux/v0.x/tags: [date/time]
introduced: 0.116.0
---

The `today()` function returns the `now()` timestamp truncated to the day unit.

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
