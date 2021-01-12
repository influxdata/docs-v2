---
title: length() function
description: The `length()` function returns the number of items in an array.
menu:
  flux_0_x_ref:
    name: length
    parent: built-in-misc
weight: 401
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/length/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/length/
introduced: 0.7.0
---

The `length()` function returns the number of items in an array.

_**Function type:** Miscellaneous_  

```js
length(arr: [])
```

## Parameters

### arr
The array to evaluate.

## Examples
```js
people = ["John", "Jane", "Abed"]

length(arr: people)

// Returns 3
```
