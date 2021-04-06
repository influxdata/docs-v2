---
title: tickscript.compute() function
description: >
  The `tickscript.compute()` function is an alias for `tickscript.select()` that
  changes a column's name and optionally applies an aggregate or selector function
  to values in the column.
menu:
  influxdb_2_0_ref:
    name: tickscript.compute
    parent: TICKscript
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/select/
  - /{{< latest "kapacitor" >}}/nodes/query_node/
---

The `tickscript.compute()` function is an **alias for
[`tickscript.select()`](/influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/select/)**
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

### column
Column to operate on.
Default is `_value`.

_**Data type:** String_

### fn
[Aggregate](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/)
or [selector](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/)
function to apply.

_**Data type:** Function_

### as
({{< req >}})
New column name.

_**Data type:** String_

## Examples

For examples, see [`tickscript.select()`](/influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/select/#examples).

{{% note %}}
#### Package author and maintainer
**Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}

