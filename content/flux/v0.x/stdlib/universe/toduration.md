---
title: toDuration() function
description: The `toDuration()` function converts all values in the `_value` column to durations.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/toduration
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/toduration/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/toduration/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/toduration/
menu:
  flux_0_x_ref:
    name: toDuration
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
introduced: 0.7.0
deprecated: 0.37.0
---

{{% warn %}}
**`toDuration()` was removed in Flux 0.37.**
{{% /warn %}}

The `toDuration()` function converts all values in the `_value` column to durations.

_**Function type:** Type conversion_  

```js
toDuration()
```

_**Supported data types:** Integer | String | Uinteger_

{{% note %}}
`duration()` assumes **numeric** input values are **nanoseconds**.
**String** input values must use [duration literal representation](/flux/v0.x/spec/lexical-elements/#duration-literals).
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
  |> toDuration()
```

## Function definition
```js
toDuration = (tables=<-) =>
  tables
    |> map(fn:(r) => ({ r with _value: duration(v: r._value) }))
```

_**Used functions:**
[map()](/flux/v0.x/stdlib/universe/map),
[duration()](/flux/v0.x/stdlib/universe/duration)_
