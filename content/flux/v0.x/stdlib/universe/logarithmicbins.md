---
title: logarithmicBins() function
description: The `logarithmicBins()` function generates a list of exponentially separated floats.
aliases:
  - /influxdb/v2.0/reference/flux/functions/misc/logarithmicbins
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/logarithmicbins/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/logarithmicbins/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/logarithmicbins/
menu:
  flux_0_x_ref:
    name: logarithmicBins
    parent: universe
weight: 102
---

The `logarithmicBins()` function generates a list of exponentially separated floats.
It is a helper function meant to generate bin bounds for the
[`histogram()` function](/flux/v0.x/stdlib/universe/histogram).

_**Output data type:** Array of floats_

```js
logarithmicBins(
  start:1.0, 
  factor: 2.0, 
  count: 10, 
  infinity: true
)
```

## Parameters

### start {data-type="float"}
The first value in the returned bin list.

### factor {data-type="float"}
The multiplier applied to each subsequent bin.

### count {data-type="int"}
The number of bins to create.

### infinity {data-type="bool"}
When `true`, adds an additional bin with a value of positive infinity.
Defaults to `true`.

## Examples
```js
logarithmicBins(start: 1.0, factor: 2.0, count: 10, infinity: true)

// Generated list: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, +Inf]
```
