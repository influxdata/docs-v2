---
title: date.week() function
description: >
  The `date.week()` function returns the ISO week of the year for a specified time.
  Results range from `[1-53]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/week/
  - /influxdb/v2.0/reference/flux/stdlib/date/week/
  - /influxdb/cloud/reference/flux/stdlib/date/week/
menu:
  flux_0_x_ref:
    name: date.week
    parent: date
weight: 301
introduced: 0.37.0
---

The `date.week()` function returns the ISO week of the year for a specified time.
Results range from `[1-53]`.

```js
import "date"

date.week(t: 2019-07-17T12:05:21.012Z)

// Returns 29
```

## Parameters

### t {data-type="time, duration"}
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

## Examples

##### Return the week of the year
```js
import "date"

date.week(t: 2020-02-11T12:21:03.293534940Z)

// Returns 7
```

##### Return the week of the year using a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.week(t: -12d)

// Returns 5
```
