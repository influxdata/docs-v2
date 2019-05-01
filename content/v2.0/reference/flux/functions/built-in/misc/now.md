---
title: now() function
description: The `now()` function returns the current time (GMT).
menu:
  v2_0_ref:
    name: now
    parent: built-in-misc
weight: 401
---

The `now()` function returns the current time (GMT).

_**Function type:** Date/Time_  
_**Output data type:** Time_

```js
now()
```

## Examples
```js
data
  |> range(start: -10h, stop: now())
```
