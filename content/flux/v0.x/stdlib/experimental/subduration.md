---
title: experimental.subDuration() function
description: >
  The `experimental.subDuration()` function subtracts a duration from a time value and
  returns a the resulting time value.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/subduration/
  - /influxdb/cloud/reference/flux/stdlib/experimental/subduration/
menu:
  flux_0_x_ref:
    name: experimental.subDuration
    parent: experimental
weight: 302
flux/v0.x/tags: [date/time]
related:
  - /flux/v0.x/stdlib/experimental/addduration/
introduced: 0.39.0
deprecated: 0.162.0
---

{{% warn %}}
This function was promoted to the [`date` package](/flux/v0.x/stdlib/date/sub/)
in **Flux v0.162.0**. This experimental version has been deprecated.
{{% /warn %}}

The `experimental.subDuration()` function subtracts a duration from a time value and
returns the resulting time value.

```js
import "experimental"

experimental.subDuration(
    d: 12h,
    from: now(),
)
```

## Parameters

### d {data-type="duration"}
Duration to subtract.

### from {data-type="time, duration"}
Time to subtract the [duration](#d) from.
Use an absolute time or a relative duration.
Durations are relative to [`now()`](/flux/v0.x/stdlib/universe/now/).

## Examples

### Subtract six hours from a timestamp
```js
import "experimental"

experimental.subDuration(d: 6h, from: 2019-09-16T12:00:00Z)

// Returns 2019-09-16T06:00:00.000000000Z
```

### Subtract six hours from a relative duration
```js
import "experimental"

option now = () => 2022-01-01T12:00:00Z

experimental.subDuration(d: 6h, from: -3h)

// Returns 2022-01-01T03:00:00.000000000Z
```
