---
title: toInt() function
description: The toInt() function converts all values in the "_value" column to integers.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/toint
menu:
  v2_0_ref:
    name: toInt
    parent: built-in-type-conversions
weight: 501
---

The `toInt()` function converts all values in the `_value` column to integers.

_**Function type:** Type conversion_  
_**Output data type:** Integer_

```js
toInt()
```

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toInt()
```

## Function definition
```js
toInt = (tables=<-) =>
  tables
    |> map(fn:(r) => int(v: r._value))
```

_**Used functions:**
[map()](/v2.0/reference/flux/functions/built-in/transformations/map),
[int()](/v2.0/reference/flux/functions/built-in/transformations/type-conversions/int)_
