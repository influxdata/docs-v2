---
title: now() function
description: The `now()` function returns the current time (UTC).
aliases:
  - /v2.0/reference/flux/functions/built-in/misc/now/
menu:
  v2_0_ref:
    name: now
    parent: built-in-misc
weight: 401
related:
  - /v2.0/reference/flux/stdlib/system/time/
---

The `now()` function returns the current time (UTC).

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

{{% note %}}
#### now() vs system.time()
`now()` returns the current UTC time.
[`system.time()`](/v2.0/reference/flux/stdlib/system/time/) returns the current
system time of the host machine, which typically accounts for the local time zone.
{{% /note %}}
