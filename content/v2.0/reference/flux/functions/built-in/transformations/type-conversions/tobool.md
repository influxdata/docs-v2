---
title: toBool() function
description: The toBool() function converts all values in the "_value" column to booleans.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/tobool
menu:
  v2_0_ref:
    name: toBool
    parent: built-in-type-conversions
weight: 501
---

The `toBool()` function converts all values in the `_value` column to booleans.

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

_**Used functions:**
[map()](/v2.0/reference/flux/functions/built-in/transformations/map), 
[bool()](/v2.0/reference/flux/functions/built-in/transformations/type-conversions/bool)_
