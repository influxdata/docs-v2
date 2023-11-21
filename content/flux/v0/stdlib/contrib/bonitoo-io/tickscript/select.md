---
title: tickscript.select() function
description: >
  `tickscript.select()` changes a column’s name and optionally applies an aggregate or selector
  function to values in the column.
menu:
  flux_v0_ref:
    name: tickscript.select
    parent: contrib/bonitoo-io/tickscript
    identifier: contrib/bonitoo-io/tickscript/select
weight: 301
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/bonitoo-io/tickscript/tickscript.flux#L310-L318

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`tickscript.select()` changes a column’s name and optionally applies an aggregate or selector
function to values in the column.

## TICKscript helper function

`tickscript.select()` is a helper function meant to replicate TICKscript operations like the following:

```
// Rename
query("SELECT x AS y")

// Aggregate and rename
query("SELECT f(x) AS y")
```

##### Function type signature

```js
(<-tables: B, as: string, ?column: A, ?fn: (<-: B, column: A) => stream[C]) => stream[D] where A: Equatable, C: Record, D: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Column to operate on. Default is `_value`.



### fn

Aggregate or selector function to apply.



### as
({{< req >}})
New column name.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Change the name of the value column](#change-the-name-of-the-value-column)
- [Change the name of the value column and apply an aggregate function](#change-the-name-of-the-value-column-and-apply-an-aggregate-function)
- [Change the name of the value column and apply a selector function](#change-the-name-of-the-value-column-and-apply-a-selector-function)

### Change the name of the value column

```js
import "contrib/bonitoo-io/tickscript"
import "sampledata"

sampledata.int()
    |> tickscript.select(as: "example-name")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | example-name  | *tag |
| -------------------- | ------------- | ---- |
| 2021-01-01T00:00:00Z | -2            | t1   |
| 2021-01-01T00:00:10Z | 10            | t1   |
| 2021-01-01T00:00:20Z | 7             | t1   |
| 2021-01-01T00:00:30Z | 17            | t1   |
| 2021-01-01T00:00:40Z | 15            | t1   |
| 2021-01-01T00:00:50Z | 4             | t1   |

| _time                | example-name  | *tag |
| -------------------- | ------------- | ---- |
| 2021-01-01T00:00:00Z | 19            | t2   |
| 2021-01-01T00:00:10Z | 4             | t2   |
| 2021-01-01T00:00:20Z | -3            | t2   |
| 2021-01-01T00:00:30Z | 19            | t2   |
| 2021-01-01T00:00:40Z | 13            | t2   |
| 2021-01-01T00:00:50Z | 1             | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Change the name of the value column and apply an aggregate function

```js
import "contrib/bonitoo-io/tickscript"
import "sampledata"

sampledata.int()
    |> tickscript.select(as: "sum", fn: sum)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| *tag | sum  |
| ---- | ---- |
| t1   | 51   |

| *tag | sum  |
| ---- | ---- |
| t2   | 53   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Change the name of the value column and apply a selector function

```js
import "contrib/bonitoo-io/tickscript"
import "sampledata"

sampledata.int()
    |> tickscript.select(as: "max", fn: max)

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | max  | *tag |
| -------------------- | ---- | ---- |
| 2021-01-01T00:00:30Z | 17   | t1   |

| _time                | max  | *tag |
| -------------------- | ---- | ---- |
| 2021-01-01T00:00:00Z | 19   | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
