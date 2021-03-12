---
title: date.year() function
description: >
  The `date.year()` function returns the year of a specified time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/year/
menu:
  influxdb_2_0_ref:
    name: date.year
    parent: Date
weight: 301
---

The `date.year()` function returns the year of a specified time.

_**Function type:** Transformation_  

```js
import "date"

date.year(t: 2019-07-17T12:05:21.012Z)

// Returns 2019
```

## Parameters

### t
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

_**Data type:** Time | Duration_

## Examples

##### Return the year for a time value
```js
import "date"

date.year(t: 2020-02-11T12:21:03.293534940Z)

// Returns 2020
```

##### Return the year for a relative duration
```js
import "date"

option now = () => 2020-02-11T12:21:03.293534940Z

date.year(t: -14y)

// Returns 2006
```
