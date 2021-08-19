---
title: toBool() function
description: The `toBool()` function converts all values in the `_value` column to booleans.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/tobool
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/tobool/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/tobool/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/tobool/
menu:
  flux_0_x_ref:
    name: toBool
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/boolean/
  - /flux/v0.x/stdlib/universe/bool/
introduced: 0.7.0
---

The `toBool()` function converts all values in the `_value` column to booleans.

```js
toBool()
```

_**Supported data types:** String | Integer | Uinteger | Float_

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
  |> toBool()
```

## Function definition
```js
toBool = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: bool(v: r._value) }))
```

_**Used functions:**
[map()](/flux/v0.x/stdlib/universe/map),
[bool()](/flux/v0.x/stdlib/universe/bool)_
