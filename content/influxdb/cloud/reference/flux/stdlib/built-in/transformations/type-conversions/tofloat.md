---
title: toFloat() function
description: The `toFloat()` function converts all values in the `_value` column to floats.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/type-conversions/tofloat
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/type-conversions/tofloat/
menu:
  influxdb_cloud_ref:
    name: toFloat
    parent: built-in-type-conversions
weight: 501
---

The `toFloat()` function converts all values in the `_value` column to floats.

_**Function type:** Type conversion_  

```js
toFloat()
```

_**Supported data types:** Boolean | Integer | Numeric String | Uinteger_

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
[map()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/map),
[float()](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/float)_
