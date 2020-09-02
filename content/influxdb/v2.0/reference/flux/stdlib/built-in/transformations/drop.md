---
title: drop() function
description: The `drop()` function removes specified columns from a table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/drop
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/drop/
menu:
  influxdb_2_0_ref:
    name: drop
    parent: built-in-transformations
weight: 402
---

The `drop()` function removes specified columns from a table.
Columns are specified either through a list or a predicate function.
When a dropped column is part of the group key, it will be removed from the key.
If a specified column is not present in a table, it will return an error.

_**Function type:** Transformation_  
_**Output data type:** Record_

```js
drop(columns: ["col1", "col2"])

// OR

drop(fn: (column) => column =~ /usage*/)
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/influxdb/v2.0/reference/flux/language/data-model/#match-parameter-names).
{{% /note %}}

### columns

Columns to be removed from the table.
Cannot be used with `fn`.

_**Data type:** Array of strings_

### fn

A predicate function which takes a column name as a parameter (`column`) and returns
a boolean indicating whether or not the column should be removed from the table.
Cannot be used with `columns`.

_**Data type:** Function_

## Examples

##### Drop a list of columns

```js
from(bucket: "example-bucket")
	|> range(start: -5m)
	|> drop(columns: ["host", "_measurement"])
```

##### Drop columns matching a predicate

```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> drop(fn: (column) => column =~ /usage*/)
```
