---
title: experimental.count() function
description: >
  The `experimental.count()` function outputs the number of records in each input table
  and returns the count in the `_value` column.
menu:
  influxdb_2_0_ref:
    name: experimental.count
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/count/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#count, InfluxQL – COUNT()
---

The `experimental.count()` function outputs the number of records in each input table
and returns the count in the `_value` column.
This function counts both null and non-null records.

_**Function type:** Aggregate_  
_**Output data type:** Integer_

```js
import "experimental"

experimental.count()
```

{{% note %}}
#### Empty tables
`experimental.count()` returns `0` for empty tables.
To keep empty tables in your data, set the following parameters for the following functions:

| Function                                                                                              | Parameter           |
|:--------                                                                                              |:---------           |
| [filter()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/)                              | `onEmpty: "keep"`   |
| [window()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/window/)                              | `createEmpty: true` |
| [aggregateWindow()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/) | `createEmpty: true` |
{{% /note %}}

## Examples
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> experimental.count()
```
