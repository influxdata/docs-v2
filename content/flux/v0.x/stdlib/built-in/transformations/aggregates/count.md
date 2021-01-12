---
title: count() function
description: The `count()` function outputs the number of non-null records in a column.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/count
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/count/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/count/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/count/
menu:
  flux_0_x_ref:
    name: count
    parent: built-in-aggregates
weight: 501
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#count, InfluxQL – COUNT()
introduced: 0.7.0
---

The `count()` function outputs the number of records in a column.
It counts both null and non-null records.

_**Function type:** Aggregate_  
_**Output data type:** Integer_

```js
count(column: "_value")
```

{{% note %}}
#### Empty tables
`count()` returns `0` for empty tables.
To keep empty tables in your data, set the following parameters for the following functions:

| Function                                                                                              | Parameter           |
|:--------                                                                                              |:---------           |
| [filter()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/)                              | `onEmpty: "keep"`   |
| [window()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/window/)                              | `createEmpty: true` |
| [aggregateWindow()](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/aggregatewindow/) | `createEmpty: true` |
{{% /note %}}

## Parameters

### column
The column on which to operate.
Defaults to `"_value"`.

_**Data type:** String_

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> count()
```

```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> count(column: "_value")
```
