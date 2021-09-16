---
title: date.microsecond() function
description: >
  The `date.microsecond()` function returns the microsecond of a specified time.
  Results range from `[0-999999]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/microsecond/
  - /influxdb/v2.0/reference/flux/stdlib/date/microsecond/
  - /influxdb/cloud/reference/flux/stdlib/date/microsecond/
menu:
  flux_0_x_ref:
    name: date.microsecond
    parent: date
weight: 301
introduced: 0.37.0
---

The `date.microsecond()` function returns the microsecond of a specified time.
Results range from `[0-999999]`.

```js
import "date"

date.microsecond(t: 2019-07-17T12:05:21.012934584Z)

// Returns 12934
```

## Parameters

### t {data-type="time, duration"}
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

## Examples

##### Return the microsecond of a time value
```js
import "date"

date.microsecond(t: 2020-02-11T12:21:03.293534940Z)

// Returns 293534
```

##### Return the microsecond of a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.microsecond(t: -1890us)

// Returns 291644
```
