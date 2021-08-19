---
title: toUInt() function
description: The `toUInt()` function converts all values in the `_value` column to UIntegers.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/touint
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/touint/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/touint/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/touint/
menu:
  flux_0_x_ref:
    name: toUInt
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/uinteger/
  - /flux/v0.x/stdlib/universe/uint/
introduced: 0.7.0
---

The `toUInt()` function converts all values in the `_value` column to UIntegers.

```js
toUInt()
```

_**Supported data types:** Boolean | Duration | Numeric String | Float | Integer | Time_

`toInt()` behavior depends on the `_value` column data type:

| \_value type | Returned value                                                  |
| :----------- | :-------------------------------------------------------------- |
| string       | UInteger equivalent of the numeric string                       |
| bool         | 1 (true) or 0 (false)                                           |
| duration     | Number of nanoseconds in the specified duration                 |
| time         | Equivalent nanosecond epoch timestamp                           |
| float        | UInteger equivalent of the float value truncated at the decimal |
| int          | UInteger equivalent of the integer                              |

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace `_value` with your desired column.
{{% /note %}}

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
[map()](/flux/v0.x/stdlib/universe/map),
[uint()](/flux/v0.x/stdlib/universe/uint)_
