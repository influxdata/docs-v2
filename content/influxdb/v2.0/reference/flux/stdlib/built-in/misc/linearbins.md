---
title: linearBins() function
description: The `linearBins()` function generates a list of linearly separated floats.
aliases:
  - /influxdb/v2.0/reference/flux/functions/misc/linearbins
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/linearbins/
menu:
  influxdb_2_0_ref:
    name: linearBins
    parent: built-in-misc
weight: 401
---

The `linearBins()` function generates a list of linearly separated floats.
It is a helper function meant to generate bin bounds for the
[`histogram()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/histogram).

_**Function type:** Miscellaneous_  
_**Output data type:** Array of floats_

```js
linearBins(start: 0.0, width: 5.0, count: 20, infinity: true)
```

## Parameters

### start
The first value in the returned list.

_**Data type:** Float_

### width
The distance between subsequent bin values.

_**Data type:** Float_

### count
The number of bins to create.

_**Data type:** Integer_

### infinity
When `true`, adds an additional bin with a value of positive infinity.
Defaults to `true`.

_**Data type:** Boolean_

## Examples

```js
linearBins(start: 0.0, width: 10.0, count: 10)

// Generated list: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, +Inf]
```
