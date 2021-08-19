---
title: tickscript.groupBy() function
description: >
  The `tickscript.groupBy()` function groups results by the `_measurement` column
  and other specified columns.
menu:
  flux_0_x_ref:
    name: tickscript.groupBy
    parent: tickscript
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/groupby/
  - /influxdb/cloud/reference/flux/stdlib/contrib/tickscript/groupby/
related:
  - /{{< latest "kapacitor" >}}/nodes/query_node/#groupby, Kapacitor QueryNode - groupBy
flux/v0.x/tags: [transformations]
---

The `tickscript.groupBy()` function groups results by the `_measurement` column and
other specified columns.

_This function is comparable to [Kapacitor QueryNode .groupBy](/{{< latest "kapacitor" >}}/nodes/query_node/#groupby)._

{{% note %}}
To group by intervals of time, use [`window()`](/flux/v0.x/stdlib/universe/window/)
or [`tickscript.selectWindow()`](/flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/selectwindow/).
{{% /note %}}

```js
import "contrib/bonitoo-io/tickscript"

tickscript.groupBy(
  columns: ["exampleColumn"]
)
```

## Parameters

### columns {data-type="array of strings"}
({{< req >}})
List of columns to group by.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

##### Group by host and region
```js
import "contrib/bonitoo-io/tickscript"

data
  |> tickscript.groupBy(
    columns: ["host", "region"]
  )
```
