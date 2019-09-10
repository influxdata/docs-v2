---
title: toTime() function
description: The `toTime()` function converts all values in the `_value` column to times.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/totime
  - /v2.0/reference/flux/functions/built-in/transformations/type-conversions/totime/
menu:
  v2_0_ref:
    name: toTime
    parent: built-in-type-conversions
weight: 501
---

The `toTime()` function converts all values in the `_value` column to times.

_**Function type:** Type conversion_  
_**Output data type:** Time_

```js
toTime()
```

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
[map()](/v2.0/reference/flux/functions/built-in/transformations/map),
[time()](/v2.0/reference/flux/functions/built-in/transformations/type-conversions/time)_
