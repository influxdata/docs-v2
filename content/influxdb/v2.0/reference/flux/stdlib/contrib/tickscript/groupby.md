---
title: tickscript.groupBy() function
description: >
  The `tickscript.groupBy()` function groups results by the `_measurement` column
  and other specified columns.
menu:
  influxdb_2_0_ref:
    name: tickscript.groupBy
    parent: TICKscript
weight: 302
related:
  - /{{< latest "kapacitor" >}}/nodes/query_node/#groupby, Kapacitor QueryNode - groupBy
---

The `tickscript.groupBy()` function groups results by the `_measurement` column and
other specified columns.

_This function is comparable to [Kapacitor QueryNode .groupBy](/{{< latest "kapacitor" >}}/nodes/query_node/#groupby)._

{{% note %}}
To group by intervals of time, use [`window()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/window/)
or [`tickscript.selectWindow()`](/influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/selectwindow/).
{{% /note %}}

```js
import "contrib/bonitoo-io/tickscript"

tickscript.groupBy(
  columns: ["exampleColumn"]
)
```

## Parameters

### columns
({{< req >}})
List of columns to group by.

_**Data type:** Array of Strings_

## Examples

##### Group by host and region
```js
import "contrib/bonitoo-io/tickscript"

data
  |> tickscript.groupBy(
    columns: ["host", "region"]
  )
```

{{% note %}}
#### Package author and maintainer
**Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}

