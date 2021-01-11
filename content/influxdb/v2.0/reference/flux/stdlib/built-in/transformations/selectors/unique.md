---
title: unique() function
description: The `unique()` function returns all records containing unique values in a specified column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors/unique
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/unique/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/unique/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/unique/
menu:
  influxdb_2_0_ref:
    name: unique
    parent: built-in-selectors
weight: 501
introduced: 0.7.0
---

The `unique()` function returns all records containing unique values in a specified column.
Group keys, record columns, and values are **not** modified.

_**Function type:** Selector_  
_**Output data type:** Record_

```js
unique(column: "_value")
```

{{% warn %}}
#### Empty tables
`unique()` drops empty tables.
{{% /warn %}}

## Parameters

### column
The column searched for unique values.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from("example-bucket")
 |> range(start: -15m)
 |> filter(fn: (r) => r._measurement == "syslog")
 |> unique(column: "message")
```
