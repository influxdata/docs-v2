---
title: date.month() function
description: >
  The `date.month()` function returns the month of a specified time.
  Results range from `[1-12]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/month/
  - /influxdb/v2.0/reference/flux/stdlib/date/month/
  - /influxdb/cloud/reference/flux/stdlib/date/month/
menu:
  flux_0_x_ref:
    name: date.month
    parent: date
weight: 301
introduced: 0.37.0
---

The `date.month()` function returns the month of a specified time.
Results range from `[1-12]` and correspond to `date` package
[month constants](/flux/v0.x/stdlib/date/#months-of-the-year).

```js
import "date"

date.month(t: 2019-07-17T12:05:21.012Z)

// Returns 7
```

## Parameters

### t {data-type="time, duration"}
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

## Examples

##### Return the month of a time value
```js
import "date"

date.month(t: 2020-02-11T12:21:03.293534940Z)

// Returns 2
```

##### Return the month of a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.month(t: -3mo)

// Returns 11
```
