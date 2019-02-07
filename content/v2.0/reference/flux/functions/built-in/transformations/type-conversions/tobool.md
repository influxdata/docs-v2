---
title: toBool() function
description: The toBool() function converts a value to a boolean.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/tobool
menu:
  v2_0_ref:
    name: toBool
    parent: built-in-type-conversions
weight: 501
---

The `toBool()` function converts a value to a boolean.

_**Function type:** Type conversion_  
_**Output data type:** Boolean_

```js
toBool()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toBool()
```

## Function definition
```js
toBool = (tables=<-) =>
  tables
    |> map(fn:(r) => bool(v: r._value))
```
