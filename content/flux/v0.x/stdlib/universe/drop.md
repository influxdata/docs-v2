---
title: drop() function
description: The `drop()` function removes specified columns from a table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/drop
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/drop/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/drop/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/drop/
menu:
  flux_0_x_ref:
    name: drop
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `drop()` function removes specified columns from a table.
Columns are specified either through a list or a predicate function.
When a dropped column is part of the group key, it will be removed from the key.
If a specified column is not present in a table, it will return an error.
 
_**Output data type:** Record_

```js
drop(columns: ["col1", "col2"])

// OR

drop(fn: (column) => column =~ /usage*/)
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### columns {data-type="array of strings"}

Columns to be removed from the table.
Cannot be used with `fn`.

### fn {data-type="function"}

A predicate function which takes a column name as a parameter (`column`) and returns
a boolean indicating whether or not the column should be removed from the table.
Cannot be used with `columns`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

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
