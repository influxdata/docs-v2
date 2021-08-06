---
title: toFloat() function
description: The `toFloat()` function converts all values in the `_value` column to floats.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/tofloat
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/tofloat/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/tofloat/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/tofloat/
menu:
  flux_0_x_ref:
    name: toFloat
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/float/
  - /flux/v0.x/stdlib/universe/float/
introduced: 0.7.0
---

The `toFloat()` function converts all values in the `_value` column to floats.

```js
toFloat()
```

_**Supported data types:** Numeric String | Boolean | Integer | Uinteger_

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
  |> toFloat()
```

## Function definition
```js
toFloat = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: float(v: r._value) }))
```

_**Used functions:**
[map()](/flux/v0.x/stdlib/universe/map),
[float()](/flux/v0.x/stdlib/universe/float)_
