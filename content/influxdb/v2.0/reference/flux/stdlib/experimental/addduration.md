---
title: experimental.addDuration() function
description: >
  The `experimental.addDuration()` function adds a duration to a time value and
  returns the resulting time.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/addduration/
  - /influxdb/cloud/reference/flux/stdlib/experimental/addduration/
menu:
  influxdb_2_0_ref:
    name: experimental.addDuration
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/subduration/
---

The `experimental.addDuration()` function adds a duration to a time value and
returns the resulting time value.

_**Function type:** Transformation_

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

### d
The duration to add.

_**Data type:** Duration_

### to
The time to add the [duration](#d) to.

_**Data type:** Time_

## Examples

### Add six hours to a timestamp
```js
import "experimental"

experimental.addDuration(
  d: 6h,
  to: 2019-09-16T12:00:00Z,
)

// Returns 2019-09-16T18:00:00.000000000Z
```
