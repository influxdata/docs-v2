---
title: date.month() function
description: >
  The `date.month()` function returns the month of the year a specified time falls in.
  Results are in the range `[1-12]`
menu:
  v2_0_ref:
    name: date.month
    parent: Date
weight: 301
---

The `date.month()` function returns the month of the year a specified time falls in.
Results are in the range `[1-12]`

_**Function type:** Transformation_  

```js
import "date"

date.month(t: 2019-07-17T12:05:21.012Z)

// Returns 7
```

## Parameters

### t
The time to operate on.

_**Data type:** Time_
