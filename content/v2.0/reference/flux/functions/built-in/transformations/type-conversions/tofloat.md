---
title: toFloat() function
description: The toFloat() function converts a value to a float.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/tofloat
menu:
  v2_0_ref:
    name: toFloat
    parent: built-in-type-conversions
weight: 501
---

The `toFloat()` function converts a value to a float.

_**Function type:** Type conversion_  
_**Output data type:** Float_

```js
toFloat()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toFloat()
```

## Function definition
```js
toFloat = (tables=<-) =>
  tables
    |> map(fn:(r) => float(v: r._value))
```
