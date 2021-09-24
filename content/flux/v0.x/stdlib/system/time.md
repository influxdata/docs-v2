---
title: system.time() function
description: The `system.time()` function returns the current system time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/misc/systemtime
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/systemtime
  - /influxdb/v2.0/reference/flux/functions/system/time/
  - /influxdb/v2.0/reference/flux/stdlib/system/time/
  - /influxdb/cloud/reference/flux/stdlib/system/time/
menu:
  flux_0_x_ref:
    name: system.time
    parent: system
weight: 401
flux/v0.x/tags: [date/time]
related:
  - /flux/v0.x/stdlib/universe/now/
  - /flux/v0.x/stdlib/universe/today/
introduced: 0.18.0
---

The `system.time()` function returns the current system time.

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

{{% note %}}
#### system.time() vs now()
`system.time()` returns the system time (UTC) at which `system.time()` is executed.
Each instance of `system.time()` in a Flux script returns a unique value.

[`now()`](/flux/v0.x/stdlib/universe/now/) returns the current system time (UTC).
`now()` is cached at runtime, so all instances of `now()` in a Flux script
return the same value.
{{% /note %}}
