---
title: date.microsecond() function
description: >
  The `date.microsecond()` function returns the microsecond of a specified time.
  Results range from `[0-999999]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/microsecond/
menu:
  influxdb_2_0_ref:
    name: date.microsecond
    parent: Date
weight: 301
---

The `date.microsecond()` function returns the microsecond of a specified time.
Results range from `[0-999999]`.

_**Function type:** Transformation_  

```js
import "date"

date.microsecond(t: 2019-07-17T12:05:21.012934584Z)

// Returns 12934
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

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
