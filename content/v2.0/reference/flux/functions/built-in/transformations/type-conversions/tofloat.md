---
title: toFloat() function
description: The toFloat() function converts all values in the "_value" column to floats.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/tofloat
menu:
  v2_0_ref:
    name: toFloat
    parent: built-in-type-conversions
weight: 501
---

The `toFloat()` function converts all values in the `_value` column to floats.

_**Function type:** Type conversion_  
_**Output data type:** Float_

```js
toFloat()
```

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace the column in the `float()` function with your desired column.
{{% /note %}}

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

_**Used functions:**
[map()](/v2.0/reference/flux/functions/built-in/transformations/map),
[float()](/v2.0/reference/flux/functions/built-in/transformations/type-conversions/float)_
