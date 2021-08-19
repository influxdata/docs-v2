---
title: toString() function
description: The `toString()` function converts all values in the `_value` column to strings.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/tostring
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/tostring/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/tostring/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/tostring/
menu:
  flux_0_x_ref:
    name: toString
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
introduced: 0.7.0
---

The `toString()` function converts all values in the `_value` column to strings.

```js
toString()
```

_**Supported data types:** Boolean | Bytes | Duration | Float | Integer | Time | Uinteger_

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
  |> toString()
```

## Function definition
```js
toString = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: string(v: r._value) }))
```

_**Used functions:**
[map()](/flux/v0.x/stdlib/universe/map),
[string()](/flux/v0.x/stdlib/universe/string)_
