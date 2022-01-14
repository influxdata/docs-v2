---
title: experimental.addDuration() function
description: >
  The `experimental.addDuration()` function adds a duration to a time value and
  returns the resulting time.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/addduration/
  - /influxdb/cloud/reference/flux/stdlib/experimental/addduration/
menu:
  flux_0_x_ref:
    name: experimental.addDuration
    parent: experimental
weight: 302
flux/v0.x/tags: [date/time]
related:
  - /flux/v0.x/stdlib/experimental/subduration/
introduced: 0.39.0
---

The `experimental.addDuration()` function adds a duration to a time value and
returns the resulting time value.

{{% warn %}}
This function will be removed once duration vectors are implemented.
See [influxdata/flux#413](https://github.com/influxdata/flux/issues/413).
{{% /warn %}}

```js
import "experimental"

experimental.addDuration(
    d: 12h,
    to: now(),
)
```

## Parameters

### d {data-type="duration"}
The duration to add.

### to {data-type="time, duration"}
The time to add the [duration](#d) to.
Use an absolute time or a relative duration.
Durations are relative to [`now()`](/flux/v0.x/stdlib/universe/now/).

## Examples

### Add six hours to a timestamp
```js
import "experimental"

experimental.addDuration(d: 6h, to: 2019-09-16T12:00:00Z)

// Returns 2019-09-16T18:00:00.000000000Z
```

### Add six hours to a relative duration
```js
import "experimental"

option now = () => 2022-01-01T12:00:00Z

experimental.addDuration(d: 6h, to: 3h)

// Returns 2022-01-01T21:00:00.000000000Z
```
