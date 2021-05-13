---
title: tickscript.compute() function
description: >
  The `tickscript.compute()` function is an alias for `tickscript.select()` that
  changes a column's name and optionally applies an aggregate or selector function
  to values in the column.
menu:
  flux_0_x_ref:
    name: tickscript.compute
    parent: tickscript
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/compute/
  - /influxdb/cloud/reference/flux/stdlib/contrib/tickscript/compute/
related:
  - /flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/select/
  - /{{< latest "kapacitor" >}}/nodes/query_node/
flux/v0.x/tags: [transformations]
---

The `tickscript.compute()` function is an **alias for
[`tickscript.select()`](/flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/select/)**
that changes a column's name and optionally applies an aggregate or selector function.

```js
import "contrib/bonitoo-io/tickscript"

tickscript.compute(
  column: "_value",
  fn: sum,
  as: "example-name"
)
```

#### TICKscript helper function
`tickscript.select()` is a helper function meant to replicate TICKscript operations
like the following:

```js
// Rename
query("SELECT x AS y")

// Aggregate and rename
query("SELECT f(x) AS y")
```

## Parameters

### column {data-type="string"}
Column to operate on.
Default is `_value`.

### fn {data-type="function"}
[Aggregate](/flux/v0.x/function-types/#aggregates) or [selector](/flux/v0.x/function-types/#selectors)
function to apply.

### as {data-type="string"}
({{< req >}})
New column name.

## Examples

For examples, see [`tickscript.select()`](/flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/select/#examples).
