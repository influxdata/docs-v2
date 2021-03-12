---
title: date.weekDay() function
description: >
  The `date.weekDay()` function returns the day of the week for a specified time.
  Results range from `[0-6]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/weekday/
menu:
  influxdb_2_0_ref:
    name: date.weekDay
    parent: Date
weight: 301
---

The `date.weekDay()` function returns the day of the week for a specified time.
Results range from `[0-6]`.

_**Function type:** Transformation_  

```js
import "date"

date.weekDay(t: 2019-07-17T12:05:21.012Z)

// Returns 3
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

## Examples

##### Return the day of the week for a time value
```js
import "date"

date.weekDay(t: 2020-02-11T12:21:03.293534940Z)

// Returns 2
```

##### Return the day of the week for a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.weekDay(t: -84h)

// Returns 6
```
