---
title: experimental.count() function
description: >
  The `experimental.count()` function outputs the number of records in each input table
  and returns the count in the `_value` column.
menu:
  flux_0_x_ref:
    name: experimental.count
    parent: experimental
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/count/
  - /influxdb/cloud/reference/flux/stdlib/experimental/count/
related:
  - /flux/v0.x/stdlib/universe/count/
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#count, InfluxQL – COUNT()
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.107.0
---

The `experimental.count()` function outputs the number of records in each input table
and returns the count in the `_value` column.
This function counts both null and non-null records.

```js
import "experimental"

experimental.count()
```

{{% note %}}
#### Empty tables
`experimental.count()` returns `0` for empty tables.
To keep empty tables in your data, set the following parameters for the following functions:

| Function                                                         | Parameter           |
|:--------                                                         |:---------           |
| [filter()](/flux/v0.x/stdlib/universe/filter/)                   | `onEmpty: "keep"`   |
| [window()](/flux/v0.x/stdlib/universe/window/)                   | `createEmpty: true` |
| [aggregateWindow()](/flux/v0.x/stdlib/universe/aggregatewindow/) | `createEmpty: true` |
{{% /note %}}

## Examples
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> experimental.count()
```
