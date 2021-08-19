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
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

The `set()` function assigns a static value to each record in the input table.
The key may modify an existing column or add a new column to the tables.
If the modified column is part of the group key, the output tables are regrouped as needed.

```js
set(key: "myKey",value: "myValue")
```

## Parameters

### key {data-type="string"}
({{< req >}})
The label of the column to modify or set.

### value {data-type="string"}
({{< req >}})
The string value to set.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
from(bucket: "example-bucket")
  |> set(key: "host", value: "prod-node-1")
```
