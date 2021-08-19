---
title: toInt() function
description: The `toInt()` function converts all values in the `_value` column to integers.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/toint
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/toint/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/toint/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/toint/
menu:
  flux_0_x_ref:
    name: toInt
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
introduced: 0.7.0
related:
  - /flux/v0.x/data-types/basic/integer/
  - /flux/v0.x/stdlib/universe/int/
---

The `toInt()` function converts all values in the `_value` column to integers.

```js
toInt()
```

_**Supported data types:** Boolean | Duration | Float | Numeric String | Time | Uinteger_

`toInt()` behavior depends on the `_value` column data type:

| \_value type | Returned value                                  |
| :----------- | :---------------------------------------------- |
| string       | Integer equivalent of the numeric string        |
| bool         | 1 (true) or 0 (false)                           |
| duration     | Number of nanoseconds in the specified duration |
| time         | Equivalent nanosecond epoch timestamp           |
| float        | Value truncated at the decimal                  |
| uint         | Integer equivalent of the unsigned integer      |

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
  |> toInt()
```

## Function definition
```js
toInt = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: int(v: r._value) }))
```

_**Used functions:**
[map()](/flux/v0.x/stdlib/universe/map),
[int()](/flux/v0.x/stdlib/universe/int)_
