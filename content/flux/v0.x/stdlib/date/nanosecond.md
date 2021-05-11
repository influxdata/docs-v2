---
title: date.nanosecond() function
description: >
  The `date.nanosecond()` function returns the nanosecond of a specified time.
  Results range from `[0-999999999]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/nanosecond/
  - /influxdb/v2.0/reference/flux/stdlib/date/nanosecond/
  - /influxdb/cloud/reference/flux/stdlib/date/nanosecond/
menu:
  flux_0_x_ref:
    name: date.nanosecond
    parent: date
weight: 301
introduced: 0.37.0
---

The `date.nanosecond()` function returns the nanosecond of a specified time.
Results range from `[0-999999999]`.

```js
import "date"

date.nanosecond(t: 2019-07-17T12:05:21.012934584Z)

// Returns 12934584
```

## Parameters

### t {data-type="time, duration"}
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

## Examples

##### Return the nanosecond for a time value
```js
import "date"

date.nanosecond(t: 2020-02-11T12:21:03.293534940Z)

// Returns 293534940Z
```

##### Return the nanosecond for a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.nanosecond(t: -2111984ns)

// Returns 291422956
```
