---
title: toString() function
description: The `toString()` function converts all values in the `_value` column to strings.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/tostring
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/tostring/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/tostring/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/tostring/
menu:
  influxdb_2_0_ref:
    name: toString
    parent: built-in-type-conversions
weight: 501
introduced: 0.7.0
---

The `toString()` function converts all values in the `_value` column to strings.

_**Function type:** Type conversion_  

```js
toString()
```

_**Supported data types:** Boolean | Bytes | Duration | Float | Integer | Time | Uinteger_

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
  |> toString()
```

## Function definition
```js
toString = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: string(v: r._value) }))
```

_**Used functions:**
[map()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map),
[string()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/string)_
