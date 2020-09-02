---
title: toInt() function
description: The `toInt()` function converts all values in the `_value` column to integers.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/toint
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/toint/
menu:
  influxdb_2_0_ref:
    name: toInt
    parent: built-in-type-conversions
weight: 501
---

The `toInt()` function converts all values in the `_value` column to integers.

_**Function type:** Type conversion_  

```js
toInt()
```

_**Supported data types:** Boolean | Duration | Float | Numeric String | Time | Uinteger_

For duration and time values, `toInt()` returns the following:

| Input type | Returned value                                      |
|:---------- |:--------------                                      |
| Duration   | The number of nanoseconds in the specified duration |
| Time       | A nanosecond epoch timestamp                        |

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
  |> toInt()
```

## Function definition
```js
toInt = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: int(v: r._value) }))
```

_**Used functions:**
[map()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map),
[int()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/int)_
