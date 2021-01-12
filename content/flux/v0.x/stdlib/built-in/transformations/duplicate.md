---
title: duplicate() function
description: The `duplicate()` function duplicates a specified column in a table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/duplicate
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/duplicate/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/duplicate/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/duplicate/
menu:
  flux_0_x_ref:
    name: duplicate
    parent: built-in-transformations
weight: 402
introduced: 0.7.0
---

The `duplicate()` function duplicates a specified column in a table.
If the specified column is part of the group key, it will be duplicated, but will
not be part of the output table's group key.

_**Function type:** Transformation_  
_**Output data type:** Record_

```js
duplicate(column: "column-name", as: "duplicate-name")
```

## Parameters

### column
The column to duplicate.

_**Data type:** String_

### as
The name assigned to the duplicate column.

_**Data type:** String_

{{% note %}}
If the `as` column already exists, this function will overwrite the existing values.
{{% /note %}}

## Examples
```js
from(bucket: "example-bucket")
	|> range(start:-5m)
	|> filter(fn: (r) => r._measurement == "cpu")
	|> duplicate(column: "host", as: "server")
```
