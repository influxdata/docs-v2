---
title: date.month() function
description: >
  The `date.month()` function returns the month of a specified time.
  Results range from `[1-12]`.
aliases:
  - /influxdb/cloud/reference/flux/functions/date/month/
menu:
  influxdb_cloud_ref:
    name: date.month
    parent: Date
weight: 301
---

The `date.month()` function returns the month of a specified time.
Results range from `[1-12]`.

_**Function type:** Transformation_  

```js
import "date"

date.month(t: 2019-07-17T12:05:21.012Z)

// Returns 7
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

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
