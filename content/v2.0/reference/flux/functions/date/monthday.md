---
title: date.monthDay() function
description: >
  The `date.monthDay()` function returns the day of the month for the specified time.
  Results are in the range `[1-31]`.
menu:
  v2_0_ref:
    name: date.monthDay
    parent: Date
weight: 301
---

The `date.monthDay()` function returns the day of the month for the specified time.
Results are in the range `[1-31]`.

_**Function type:** Transformation_  

```js
import "date"

date.monthDay(t: 2019-07-17T12:05:21.012Z)

// Returns 17
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
