---
title: date.second() function
description: >
  The `date.second()` function returns the second of a specified time.
  Results range from `[0-59]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/second/
menu:
  influxdb_2_0_ref:
    name: date.second
    parent: Date
weight: 301
---

The `date.second()` function returns the second of a specified time.
Results range from `[0-59]`.

_**Function type:** Transformation_  

```js
import "date"

date.second(t: 2019-07-17T12:05:21.012Z)

// Returns 21
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

## Examples

##### Return the second of a time value
```js
import "date"

date.second(t: 2020-02-11T12:21:03.293534940Z)

// Returns 3
```

##### Return the second of a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.second(t: -50s)

// Returns 13
```
