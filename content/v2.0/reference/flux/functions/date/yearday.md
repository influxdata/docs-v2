---
title: date.yearDay() function
description: >
  The `date.yearDay()` function returns the day of the year the specified time falls in.
  Results are in the range `[1, 365]` for non-leap years, and `[1, 366]` in leap years.
menu:
  v2_0_ref:
    name: date.yearDay
    parent: Date
weight: 301
---

The `date.yearDay()` function returns the day of the year the specified time falls in.
Results are in the range `[1, 365]` for non-leap years, and `[1, 366]` in leap years.

_**Function type:** Transformation_  

```js
import "date"

date.yearDay(t: 2019-07-17T12:05:21.012Z)

// Returns 198
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
