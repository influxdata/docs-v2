---
title: length() function
description: The `length()` function returns the number of items in an array.
menu:
  flux_0_x_ref:
    name: length
    parent: universe
weight: 102
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/length/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/length/
related:
  - /flux/v0.x/data-types/composite/array/
introduced: 0.7.0
---

The `length()` function returns the number of items in an array.

```js
length(arr: [])
```

## Parameters

### arr {data-type="array"}
Array to evaluate.

## Examples
```js
people = ["John", "Jane", "Abed"]

length(arr: people)

// Returns 3
```
