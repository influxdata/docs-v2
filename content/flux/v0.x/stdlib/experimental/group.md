---
title: experimental.group() function
description: >
  The `experimental.group()` function introduces an `extend` mode to the existing
  `group()` function.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/group/
  - /influxdb/cloud/reference/flux/stdlib/experimental/group/
menu:
  flux_0_x_ref:
    name: experimental.group
    parent: experimental
weight: 302
flux/v0.x/tags: [transformations]
related:
  - /flux/v0.x/stdlib/universe/group/
introduced: 0.39.0
---

The `experimental.group()` function introduces an `extend` mode to the existing
[`group()`](/flux/v0.x/stdlib/universe/group/) function.

_**Function type:** Transformation_

{{% warn %}}
This function will be removed once the proposed `extend` mode is sufficiently vetted.
{{% /warn %}}

```js
import "experimental"

experimental.group(columns: ["host", "_measurement"], mode:"extend")
```

## Parameters

### columns {data-type="array of strings"}
List of columns to use in the grouping operation.
Defaults to `[]`.

### mode {data-type="string"}
The mode used to group columns.

{{% note %}}
`extend` is the only mode available to `experimental.group()`.
{{% /note %}}

#### extend
Appends columns defined in the [`columns` parameter](#columns) to all existing
[group keys](/influxdb/v2.0/query-data/get-started/#group-keys).

## Examples

###### Include the value column in each groups' group key
```js
import "experimental"

from(bucket: "example-bucket")
  |> range(start: -1m)
  |> experimental.group(columns: ["_value"], mode: "extend")
```
