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
`now()` is cached at runtime, so all instances of `now()` in a Flux script
return the same value.

[`system.time()`](/v2.0/reference/flux/stdlib/system/time/) returns the current
system time of the host machine, which typically accounts for the local time zone.
This time represents the time at which `system.time()` it is executed, so each
instance of `system.time()` in a Flux script returns a unique value.
{{% /note %}}
