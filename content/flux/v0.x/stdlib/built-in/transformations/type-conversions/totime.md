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
    parent: built-in-type-conversions
weight: 501
introduced: 0.7.0
---

The `toTime()` function converts all values in the `_value` column to times.

_**Function type:** Type conversion_  

```js
toTime()
```

_**Supported data types:** Integer | String | Uinteger_

{{% note %}}
`toTime()` assumes all numeric input values are nanosecond epoch timestamps.
{{% /note %}}

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
  |> toTime()
```

## Function definition
```js
toTime = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: time(v:r._value) }))
```

_**Used functions:**
[map()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map),
[time()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/time)_
