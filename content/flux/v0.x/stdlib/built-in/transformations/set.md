---
title: set() function
description: The `set()` function assigns a static value to each record in the input table.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/set
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/set/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/set/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/set/
menu:
  flux_0_x_ref:
    name: set
    parent: built-in-transformations
weight: 402
introduced: 0.7.0
---

The `set()` function assigns a static value to each record in the input table.
The key may modify an existing column or add a new column to the tables.
If the modified column is part of the group key, the output tables are regrouped as needed.

_**Function type:** Transformation_  
_**Output data type:** Record_

```js
set(key: "myKey",value: "myValue")
```

## Parameters

### key
The label of the column to modify or set.

_**Data type:** String_

### value
The string value to set.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
  |> set(key: "host", value: "prod-node-1")
```
