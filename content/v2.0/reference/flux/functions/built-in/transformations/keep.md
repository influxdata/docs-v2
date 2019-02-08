---
title: keep() function
description: The keep() function returns a table containing only the specified columns.
aliases:
  - /v2.0/reference/flux/functions/transformations/keep
menu:
  v2_0_ref:
    name: keep
    parent: built-in-transformations
weight: 401
---

The `keep()` function returns a table containing only the specified columns, ignoring all others.
Only columns in the group key that are also specified in the `keep()` function will be kept in the resulting group key.
_It is the inverse of [`drop`](/v2.0/reference/flux/functions/transformations/drop)._

_**Function type:** Transformation_  
_**Output data type:** Object_

```js
keep(columns: ["col1", "col2"])

// OR

keep(fn: (column) => column =~ /inodes*/)
```

## Parameters

### columns
Columns that should be included in the resulting table.
Cannot be used with `fn`.

_**Data type:** Array of strings_

### fn
A predicate function which takes a column name as a parameter (`column`) and returns
a boolean indicating whether or not the column should be included in the resulting table.
Cannot be used with `columns`.

_**Data type:** Function_

## Examples

##### Keep a list of columns
```js
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> keep(columns: ["_time", "_value"])
```

##### Keep all columns matching a predicate
```js
from(bucket: "telegraf/autogen")
    |> range(start: -5m)
    |> keep(fn: (column) => column =~ /inodes*/)
```
