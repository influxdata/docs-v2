---
title: date.sub() function
description: >
  `date.sub()` subtracts a duration from a time value and returns the
  resulting time value.
menu:
  flux_0_x_ref:
    name: date.sub
    parent: date
weight: 302
flux/v0.x/tags: [date/time]
aliases:
  - /flux/v0.x/stdlib/date/subduration/
related:
  - /flux/v0.x/stdlib/date/addduration/
introduced: 0.162.0
---

`date.sub()` subtracts a duration from a time value and returns the
resulting time value.

```js
import "date"

date.sub(d: 12h, from: now())
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
import "date"

date.sub(d: 6h, from: 2019-09-16T12:00:00Z)

// Returns 2019-09-16T06:00:00.000000000Z
```

### Subtract six hours from a relative duration
```js
import "date"

option now = () => 2022-01-01T12:00:00Z

date.sub(d: 6h, from: -3h)

// Returns 2022-01-01T03:00:00.000000000Z
```
