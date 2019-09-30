---
title: toUInt() function
description: The `toUInt()` function converts all values in the `_value` column to UIntegers.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/touint
  - /v2.0/reference/flux/functions/built-in/transformations/type-conversions/touint/
menu:
  v2_0_ref:
    name: toUInt
    parent: built-in-type-conversions
weight: 501
---

The `toUInt()` function converts all values in the `_value` column to UIntegers.

_**Function type:** Type conversion_  
_**Output data type:** UInteger_

```js
toUInt()
```

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace `_value` with your desired column.
{{% /note %}}

## Examples
```js
from(bucket: "telegraf")
  |> filter(fn:(r) =>
    r._measurement == "mem" and
    r._field == "used"
  )
  |> toUInt()
```

## Function definition
```js
toUInt = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: uint(v:r._value) }))
```

_**Used functions:**
[map()](/v2.0/reference/flux/stdlib/built-in/transformations/map),
[uint()](/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/uint)_
