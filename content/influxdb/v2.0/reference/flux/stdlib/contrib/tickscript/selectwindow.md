---
title: tickscript.selectWindow() function
description: >
  The `tickscript.selectWindow()` function changes a column's name, windows rows by time,
  and applies an aggregate or selector function the specified column for each window of time.
menu:
  influxdb_2_0_ref:
    name: tickscript.selectWindow
    parent: TICKscript
weight: 302
related:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/tickscript/select/
  - /{{< latest "kapacitor" >}}/nodes/query_node/
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

### column
Column to operate on.
Default is `_value`.

_**Data type:** String_

### fn
({{< req >}})
[Aggregate](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/)
or [selector](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/)
function to apply.

 _**Data type:** Function_

### as
({{< req >}})
New column name.

 _**Data type:** String_

### every
({{< req >}})
Duration of windows.

 _**Data type:** Duration_

### defaultValue
({{< req >}})
Default fill value for null values in [`column`](#column).

_Must be the same data type as `column`._

 _**Data type:** String | Boolean | Float | Integer | Uinteger | Bytes_

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

{{% note %}}
#### Package author and maintainer
**Github:** [@bonitoo-io](https://github.com/bonitoo-io), [@alespour](https://github.com/alespour)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}

