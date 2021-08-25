---
title: contains() function
description: The `contains()` function tests whether a value is a member of a set.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/tests/contains/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/tests/contains/
  - /influxdb/cloud/reference/flux/stdlib/built-in/tests/contains/
menu:
  flux_0_x_ref:
    name: contains
    parent: universe
weight: 102
flux/v0.x/tags: [tests]
introduced: 0.19.0
---

The `contains()` function tests whether a value is a member of a set.
If the value is a member of the set, the function returns `true`.
If the value is not a member of the set, the functions returns `false`.

```js
contains(
  value: 1,
  set: [1,2,3]
)
```

## Parameters

### value {data-type="string, bool, time, int, uint, float"}
Value to search for.

### set {data-type="array"}
Set of values to search in.

## Examples

###### Filter on a set of specific fields
```js
fields = ["load1", "load5", "load15"]

from(bucket: "example-bucket")
  |> range(start:start, stop: stop)
  |> filter(fn: (r) =>
      r._measurement == "system" and
      contains(value: r._field, set: fields)
  )
```
