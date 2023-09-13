---
title: table.fill() function
description: >
  `table.fill()` adds a single row to empty tables in a stream of tables.
menu:
  flux_v0_ref:
    name: table.fill
    parent: experimental/table
    identifier: experimental/table/fill
weight: 201
flux/v0.x/tags: [transformations, table]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/table/table.flux#L33-L33

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`table.fill()` adds a single row to empty tables in a stream of tables.

Columns that are in the group key are filled with the column value defined in the group key.
Columns not in the group key are filled with a null value.

##### Function type signature

```js
(<-tables: stream[A]) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Fill empty tables

```js
import "experimental/table"
import "sampledata"

data =
    sampledata.int()
        |> filter(fn: (r) => r.tag != "t2", onEmpty: "keep")

data
    |> table.fill()

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

| _time  | _value  | *tag |
| ------ | ------- | ---- |


#### Output data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time  | _value  | *tag |
| ------ | ------- | ---- |
|        |         | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
