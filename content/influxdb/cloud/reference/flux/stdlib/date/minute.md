---
title: date.minute() function
description: >
  The `date.minute()` function returns the minute of a specified time.
  Results range from `[0-59]`.
aliases:
  - /influxdb/cloud/reference/flux/functions/date/minute/
menu:
  influxdb_cloud_ref:
    name: date.minute
    parent: Date
weight: 301
---

The `date.minute()` function returns the minute of a specified time.
Results range from `[0-59]`.

_**Function type:** Transformation_  

```js
import "date"

date.minute(t: 2019-07-17T12:05:21.012Z)

// Returns 5
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

## Examples

##### Return the minute of a time value
```js
import "date"

date.minute(t: 2020-02-11T12:21:03.293534940Z)

// Returns 21
```

##### Return the minute of a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.minute(t: -45m)

// Returns 36
```
