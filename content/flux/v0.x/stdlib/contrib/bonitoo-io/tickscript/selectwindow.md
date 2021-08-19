---
title: tickscript.selectWindow() function
description: >
  The `tickscript.selectWindow()` function changes a column's name, windows rows by time,
  and applies an aggregate or selector function the specified column for each window of time.
menu:
  flux_0_x_ref:
    name: tickscript.selectWindow
    parent: tickscript
weight: 302
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/selectwindow/
  - /influxdb/cloud/reference/flux/stdlib/contrib/tickscript/selectwindow/
related:
  - /flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/select/
  - /{{< latest "kapacitor" >}}/nodes/query_node/
flux/v0.x/tags: [transformations]
introduced: 0.111.0
---

The `tickscript.selectWindow()` function changes a column's name, windows rows by time,
and applies an aggregate or selector function the specified column for each window of time.

```js
import "contrib/bonitoo-io/tickscript"

tickscript.selectWindow(
  column: "_value",
  fn: sum,
  as: "example-name",
  every: 1m,
  defaultValue: 0.0,
)
```

#### TICKscript helper function
`tickscript.selectWindow()` is a helper function meant to replicate TICKscript operations
like the following:

```js
// Rename, window, and aggregate
query("SELECT f(x) AS y")
  .groupBy(time(t), ...)
```

## Parameters

### column {data-type="string"}
Column to operate on.
Default is `_value`.

_**Data type:** String_

### fn {data-type="function"}
({{< req >}})
[Aggregate](/flux/v0.x/function-types/#saggregates/) or [selector](/flux/v0.x/function-types/#selectors)
function to apply.

### as {data-type="string"}
({{< req >}})
New column name.

### every {data-type="duration"}
({{< req >}})
Duration of windows.

### defaultValue {data-type="string, bool, int, uint, float, bytes"}
({{< req >}})
Default fill value for null values in [`column`](#column).

_Must be the same data type as `column`._

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples

#### Change the name of, window, and then aggregate the value column
```js
import "contrib/bonitoo-io/tickscript"

data
  |> tickscript.selectWindow(
    fn: sum,
    as: "example-name",
    every: 1h,
    defaultValue: 0.0
  )
```

{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T00:30:00Z | 0.8    |
| 2021-01-01T01:00:00Z | 3.2    |
| 2021-01-01T01:30:00Z | 3.9    |
| 2021-01-01T02:00:00Z |        |
| 2021-01-01T02:30:00Z | 3.3    |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time               | example-name |
|:-----               | ------------:|
| 2021-01-01T00:59:59 | 2.0          |
| 2021-01-01T01:59:59 | 7.1          |
| 2021-01-01T02:59:59 | 3.3          |
{{% /flex-content %}}
{{< /flex >}}
