---
title: toDuration() function
description: The `toDuration()` function converts all values in the `_value` column to durations.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/toduration
menu:
  v2_0_ref:
    name: toDuration
    parent: built-in-type-conversions
weight: 501
---

The `toDuration()` function converts all values in the `_value` column to durations.

_**Function type:** Type conversion_  
_**Output data type:** Duration_

```js
toDuration()
```

{{% note %}}
To convert values in a column other than `_value`, define a custom function
patterned after the [function definition](#function-definition),
but replace the column in the `duration()` function with your desired column.
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
    |> map(fn:(r) => duration(v: r._value))
```

_**Used functions:**
[map()](/v2.0/reference/flux/functions/built-in/transformations/map),
[duration()](/v2.0/reference/flux/functions/built-in/transformations/type-conversions/duration)_
