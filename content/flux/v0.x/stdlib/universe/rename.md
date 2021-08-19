---
title: rename() function
description: The `rename()` function renames specified columns in a table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/rename
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/rename/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/rename/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/rename/
menu:
  flux_0_x_ref:
    name: rename
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `rename()` function renames specified columns in a table.
If a column is renamed and is part of the group key, the column name in the group key will be updated.

There are two variants:

- one which maps old column names to new column names
- one which takes a mapping function.

```js
rename(columns: {host: "server", facility: "datacenter"})

// OR

rename(fn: (column) => "{column}_new")
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### columns {data-type="record"}

A map of columns to rename and their corresponding new names.
Cannot be used with `fn`.

### fn {data-type="function"}

A function mapping between old and new column names.
Cannot be used with `columns`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
