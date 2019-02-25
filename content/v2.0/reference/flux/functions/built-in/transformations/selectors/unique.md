---
title: unique() function
description: The `unique()` function returns all records containing unique values in a specified column.
aliases:
  - /v2.0/reference/flux/functions/transformations/selectors/unique
menu:
  v2_0_ref:
    name: unique
    parent: built-in-selectors
weight: 501
---

The `unique()` function returns all records containing unique values in a specified column.

_**Function type:** Selector_  
_**Output data type:** Object_

```js
unique(column: "_value")
```

## Parameters

### column
The column searched for unique values.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from("telegraf/autogen")
 |> range(start: -15m)
 |> filter(fn: (r) => r._measurement == "syslog")
 |> unique(column: "message")
```
