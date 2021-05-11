---
title: date.truncate() function
description: >
  The `date.truncate()` function truncates a time to a specified unit.
aliases:
  - /influxdb/v2.0/reference/flux/functions/date/truncate/
  - /influxdb/v2.0/reference/flux/stdlib/date/truncate/
  - /influxdb/cloud/reference/flux/stdlib/date/truncate/
menu:
  flux_0_x_ref:
    name: date.truncate
    parent: date
weight: 301
introduced: 0.37.0
---

The `date.truncate()` function truncates a time to a specified unit.

_**Function type:** Transformation_  

```js
import "date"

date.truncate(
  t: 2019-07-17T12:05:21.012Z
  unit: 1s
)

// Returns 2019-07-17T12:05:21.000000000Z
```

## Parameters

### t {data-type="time, duration"}
The time to operate on.
Use an absolute time, relative duration, or integer.
Durations are relative to `now()`.

### unit {data-type="duration"}
The unit of time to truncate to.

{{% note %}}
Only use `1` and the unit of time to specify the `unit`.
For example: `1s`, `1m`, `1h`.
{{% /note %}}

## Examples

##### Truncate time values
```js
import "date"

date.truncate(t: 2019-06-03T13:59:01.000000000Z, unit: 1s)
// Returns 2019-06-03T13:59:01.000000000Z

date.truncate(t: 2019-06-03T13:59:01.000000000Z, unit: 1m)
// Returns 2019-06-03T13:59:00.000000000Z

date.truncate(t: 2019-06-03T13:59:01.000000000Z, unit: 1h)
// Returns 2019-06-03T13:00:00.000000000Z
```

##### Truncate time values using durations
```js
import "date"

option now = () => 2020-01-01T00:00:30.500000000Z

date.truncate(t: -30s, unit: 1s)
// Returns 2019-12-31T23:59:30.000000000Z

date.truncate(t: -1m, unit: 1m)
// Returns 2019-12-31T23:59:00.000000000Z

date.truncate(t: -1h, unit: 1h)
// Returns 2019-12-31T23:00:00.000000000Z
```
