---
title: date.nanosecond() function
description: >
  The `date.nanosecond()` function returns the nanosecond of a specified time.
  Results range from `[0-999999999]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/nanosecond/
menu:
  influxdb_2_0_ref:
    name: date.nanosecond
    parent: Date
weight: 301
---

The `date.nanosecond()` function returns the nanosecond of a specified time.
Results range from `[0-999999999]`.

_**Function type:** Transformation_  

```js
import "date"

date.nanosecond(t: 2019-07-17T12:05:21.012934584Z)

// Returns 12934584
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

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
