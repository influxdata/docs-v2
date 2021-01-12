---
title: date.yearDay() function
description: >
  The `date.yearDay()` function returns the day of the year for a specified time.
  Results range from `[1-365]` for non-leap years, and `[1-366]` in leap years.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/yearday/
  - /influxdb/v2.0/reference/flux/stdlib/date/yearday/
  - /influxdb/cloud/reference/flux/stdlib/date/yearday/
menu:
  flux_0_x_ref:
    name: date.yearDay
    parent: Date
weight: 301
introduced: 0.37.0
---

The `date.yearDay()` function returns the day of the year for a specified time.
Results include leap days and range from `[1-366]`.

_**Function type:** Transformation_  

```js
import "date"

date.yearDay(t: 2019-07-17T12:05:21.012Z)

// Returns 198
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

## Examples

##### Return the day of the year for a time value
```js
import "date"

date.yearDay(t: 2020-02-11T12:21:03.293534940Z)

// Returns 42
```

##### Return the day of the year for a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.yearDay(t: -1mo)

// Returns 11
```
