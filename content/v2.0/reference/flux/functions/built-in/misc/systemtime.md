---
title: systemTime() function
description: The `systemTime()` function returns the current system time.
aliases:
  - /v2.0/reference/flux/functions/misc/systemtime
menu:
  v2_0_ref:
    name: systemTime
    parent: built-in-misc
weight: 401
---

The `systemTime()` function returns the current system time.

_**Function type:** Date/Time_  
_**Output data type:** Timestamp_

```js
systemTime()
```

## Examples
```js
offsetTime = (offset) => systemTime() |> timeShift(duration: offset)
```
