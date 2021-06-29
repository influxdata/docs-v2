---
title: now() function
description: The `now()` function returns the current time (UTC).
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/now/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/now/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/now/
menu:
  flux_0_x_ref:
    name: now
    parent: universe
weight: 102
flux/v0.x/tags: [data/time]
related:
  - /flux/v0.x/stdlib/universe/today/
  - /flux/v0.x/stdlib/system/time/
introduced: 0.7.0
---

The `now()` function returns the current time (UTC) or the time defined in the `now` option.

```js
now()
```

## Examples

##### Use the current UTC time as a query boundary
```js
data
  |> range(start: -10h, stop: now())
```

##### Return the now option time
```js
option now = () => 2020-01-01T00:00:00Z

now()
// Returns 2020-01-01T00:00:00.000000000Z
```

{{% note %}}
#### now() vs system.time()
`now()` returns the current UTC time.
`now()` is cached at runtime, so all instances of `now()` in a Flux script
return the same value.

[`system.time()`](/flux/v0.x/stdlib/system/time/) returns the current
system time of the host machine, which typically accounts for the local time zone.
This time represents the time at which `system.time()` it is executed, so each
instance of `system.time()` in a Flux script returns a unique value.
{{% /note %}}
