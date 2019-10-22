---
title: system.time() function
description: The `system.time()` function returns the current system time.
aliases:
  - /v2.0/reference/flux/functions/misc/systemtime
  - /v2.0/reference/flux/functions/built-in/misc/systemtime
  - /v2.0/reference/flux/functions/system/time/
menu:
  v2_0_ref:
    name: system.time
    parent: System
weight: 401
related:
  - /v2.0/reference/flux/stdlib/built-in/misc/now/
---

The `system.time()` function returns the current system time.

_**Function type:** Date/Time_  
_**Output data type:** Timestamp_

```js
import "system"

system.time()
```

## Examples
```js
import "system"

data
  |> set(key: "processed_at", value: string(v: system.time() ))
```
