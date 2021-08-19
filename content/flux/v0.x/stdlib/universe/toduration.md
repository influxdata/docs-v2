---
title: toDuration() function
description: The `toDuration()` function converts all values in the `_value` column to durations.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/toduration
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/toduration/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/toduration/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/toduration/
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
related:
  - /flux/v0.x/data-types/basic/duration/
  - /flux/v0.x/stdlib/universe/duration/
introduced: 0.7.0
removed: 0.37.0
---

{{% warn %}}
**`toDuration()` was removed in Flux 0.37.**
{{% /warn %}}

The `toDuration()` function converts all values in the `_value` column to durations.

```js
toDuration()
```

_**Supported data types:** String | Integer | Uinteger_

{{% note %}}
`duration()` assumes **numeric** input values are **nanoseconds**.
**String** input values must use [duration literal representation](/flux/v0.x/spec/lexical-elements/#duration-literals).
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
