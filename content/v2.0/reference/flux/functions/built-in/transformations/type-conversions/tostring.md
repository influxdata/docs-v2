---
title: toString() function
description: The toString() function converts all values in the "_value" column to strings.
aliases:
  - /v2.0/reference/flux/functions/transformations/type-conversions/tostring
menu:
  v2_0_ref:
    name: toString
    parent: built-in-type-conversions
weight: 501
---

The `toString()` function converts all values in the `_value` column to strings.

_**Function type:** Type conversion_  
_**Output data type:** String_

```js
toString()
```

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
    |> map(fn:(r) => string(v: r._value))
```

_**Used functions:**
[map()](/v2.0/reference/flux/functions/built-in/transformations/map),
[string()](/v2.0/reference/flux/functions/built-in/transformations/type-conversions/string)_
