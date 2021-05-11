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
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#count, InfluxQL – COUNT()
  - /flux/v0.x/stdlib/experimental/count/
introduced: 0.7.0
---

The `count()` function outputs the number of records in a column.
It counts both null and non-null records.

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
| [filter()](/flux/v0.x/stdlib/universe/filter/)                              | `onEmpty: "keep"`   |
| [window()](/flux/v0.x/stdlib/universe/window/)                              | `createEmpty: true` |
| [aggregateWindow()](/flux/v0.x/stdlib/universe/aggregatewindow/) | `createEmpty: true` |
{{% /note %}}

## Parameters

### column {data-type="string"}
The column on which to operate.
Defaults to `"_value"`.

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
