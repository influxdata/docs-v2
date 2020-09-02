---
title: date.hour() function
description: >
  The `date.hour()` function returns the hour of a specified time.
  Results range from `[0-23]`.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/hour/
menu:
  influxdb_2_0_ref:
    name: date.hour
    parent: Date
weight: 301
---

The `date.hour()` function returns the hour of a specified time.
Results range from `[0-23]`.

_**Function type:** Transformation_  

```js
import "date"

date.hour(t: 2019-07-17T12:05:21.012Z)

// Returns 12
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

## Examples

##### Return the hour of a time value
```js
import "date"

date.hour(t: 2020-02-11T12:21:03.293534940Z)

// Returns 12
```

##### Return the hour of a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.hour(t: -8h)

// Returns 4
```
