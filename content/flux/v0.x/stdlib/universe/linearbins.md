---
title: linearBins() function
description: The `linearBins()` function generates a list of linearly separated floats.
aliases:
  - /influxdb/v2.0/reference/flux/functions/misc/linearbins
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/linearbins/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/linearbins/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/linearbins/
menu:
  flux_0_x_ref:
    name: linearBins
    parent: universe
weight: 102
---

The `linearBins()` function generates a list of linearly separated floats.
It is a helper function meant to generate bin bounds for the
[`histogram()` function](/flux/v0.x/stdlib/universe/histogram).

_**Output data type:** Array of floats_

```js
linearBins(
  start: 0.0,
  width: 5.0,
  count: 20,
  infinity: true
)
```

## Parameters

### start {data-type="float"}
The first value in the returned list.

### width {data-type="float"}
The distance between subsequent bin values.

### count {data-type="int"}
The number of bins to create.

### infinity {data-type="bool"}
When `true`, adds an additional bin with a value of positive infinity.
Defaults to `true`.

## Examples

```js
linearBins(start: 0.0, width: 10.0, count: 10)

// Generated list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, +Inf]
```
