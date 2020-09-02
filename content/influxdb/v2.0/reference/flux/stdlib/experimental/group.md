---
title: experimental.group() function
description: >
  The `experimental.group()` function introduces an `extend` mode to the existing
  `group()` function.
menu:
  influxdb_2_0_ref:
    name: experimental.group
    parent: Experimental
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/group/
---

The `experimental.group()` function introduces an `extend` mode to the existing
[`group()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/group/) function.

_**Function type:** Transformation_

{{% warn %}}
This function will be removed once the proposed `extend` mode is sufficiently vetted.
{{% /warn %}}

```js
import "experimental"

experimental.group(columns: ["host", "_measurement"], mode:"extend")
```

## Parameters

### columns
List of columns to use in the grouping operation.
Defaults to `[]`.

_**Data type:** Array of strings_

### mode
The mode used to group columns.

_**Data type:** String_

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
