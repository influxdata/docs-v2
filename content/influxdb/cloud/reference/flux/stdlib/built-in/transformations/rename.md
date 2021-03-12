---
title: rename() function
description: The `rename()` function renames specified columns in a table.
aliases:
  - /influxdb/cloud/reference/flux/functions/transformations/rename
  - /influxdb/cloud/reference/flux/functions/built-in/transformations/rename/
menu:
  influxdb_cloud_ref:
    name: rename
    parent: built-in-transformations
weight: 402
---

The `rename()` function renames specified columns in a table.
If a column is renamed and is part of the group key, the column name in the group key will be updated.

There are two variants:

- one which maps old column names to new column names
- one which takes a mapping function.

_**Function type:** Transformation_

```js
rename(columns: {host: "server", facility: "datacenter"})

// OR

rename(fn: (column) => "{column}_new")
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/influxdb/cloud/reference/flux/language/data-model/#match-parameter-names).
{{% /note %}}

### columns

A map of columns to rename and their corresponding new names.
Cannot be used with `fn`.

_**Data type:** Record_

### fn

A function mapping between old and new column names.
Cannot be used with `columns`.

_**Data type:** Function_

## Examples

##### Rename a single column

```js
from(bucket: "example-bucket")
    |> range(start: -5m)
    |> rename(columns: {host: "server"})
```

##### Rename all columns using a function

```js
from(bucket: "example-bucket")
    |> range(start: -5m)
    |> rename(fn: (column) => column + "_new")
```
