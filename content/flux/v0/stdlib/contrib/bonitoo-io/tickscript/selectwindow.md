---
title: tickscript.selectWindow() function
description: >
  `tickscript.selectWindow()` changes a column’s name, windows rows by time, and then applies an
  aggregate or selector function the specified column for each window of time.
menu:
  flux_v0_ref:
    name: tickscript.selectWindow
    parent: contrib/bonitoo-io/tickscript
    identifier: contrib/bonitoo-io/tickscript/selectWindow
weight: 301
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/tickscript/tickscript.flux#L362-L379

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tickscript.selectWindow()` changes a column’s name, windows rows by time, and then applies an
aggregate or selector function the specified column for each window of time.

## TICKscript helper function
`tickscript.selectWindow` is a helper function meant to replicate TICKscript operations like the following:

```
// Rename, window, and aggregate
query("SELECT f(x) AS y")
  .groupBy(time(t), ...)
```

##### Function type signature

```js
(
    <-tables: stream[D],
    as: string,
    defaultValue: A,
    every: duration,
    fn: (<-: stream[B], column: string) => stream[C],
    ?column: string,
) => stream[E] where B: Record, C: Record, D: Record, E: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### column

Column to operate on. Default is _value.



### fn
({{< req >}})
Aggregate or selector function to apply.



### as
({{< req >}})
New column name.



### every
({{< req >}})
Duration of windows.



### defaultValue
({{< req >}})
Default fill value for null values in column.
Must be the same data type as column.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Change the name of, window, and then aggregate the value column

```js
import "contrib/bonitoo-io/tickscript"

data
    |> tickscript.selectWindow(fn: sum, as: "example-name", every: 1h, defaultValue: 0)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 4       | t1   |

| *_start              | *_stop               | _time                | _value  | *tag |
| -------------------- | -------------------- | -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | *_start              | *_stop               | *tag | example-name  |
| -------------------- | -------------------- | -------------------- | ---- | ------------- |
| 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t1   | 51            |

| _time                | *_start              | *_stop               | *tag | example-name  |
| -------------------- | -------------------- | -------------------- | ---- | ------------- |
| 2021-01-01T00:01:00Z | 2021-01-01T00:00:00Z | 2021-01-01T00:01:00Z | t2   | 53            |

{{% /expand %}}
{{< /expand-wrapper >}}
