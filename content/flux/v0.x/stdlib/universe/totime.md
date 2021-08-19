---
title: toTime() function
description: The `toTime()` function converts all values in the `_value` column to times.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/totime
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/totime/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/totime/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/totime/
menu:
  flux_0_x_ref:
    name: toTime
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/time/
  - /flux/v0.x/stdlib/universe/time/
introduced: 0.7.0
---

The `toTime()` function converts all values in the `_value` column to times.

```js
toTime()
```

_**Supported data types:** String | Integer | Uinteger_

{{% note %}}
`toTime()` assumes all numeric input values are nanosecond epoch timestamps.
{{% /note %}}

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
  |> toTime()
```

## Function definition
```js
toTime = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: time(v:r._value) }))
```

_**Used functions:**
[map()](/flux/v0.x/stdlib/universe/map),
[time()](/flux/v0.x/stdlib/universe/time)_
