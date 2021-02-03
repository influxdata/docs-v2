---
title: date.quarter() function
description: >
  The `date.quarter()` function returns the quarter of the year for a specified time.
  Results range from `[1-4]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/quarter/
  - /influxdb/v2.0/reference/flux/stdlib/date/quarter/
  - /influxdb/cloud/reference/flux/stdlib/date/quarter/
menu:
  flux_0_x_ref:
    name: date.quarter
    parent: date
weight: 301
introduced: 0.37.0
---

The `date.quarter()` function returns the quarter of the year for a specified time.
Results range from `[1-4]`.

_**Function type:** Transformation_  

```js
import "date"

date.quarter(t: 2019-07-17T12:05:21.012Z)

// Returns 3
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

## Examples

##### Return the quarter for a time value
```js
import "date"

date.quarter(t: 2020-02-11T12:21:03.293534940Z)

// Returns 1
```

##### Return the quarter for a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.quarter(t: -7mo)

// Returns 3
```
