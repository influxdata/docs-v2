---
title: columns() function
description: >
  `columns()` returns the column labels in each input table.
menu:
  flux_v0_ref:
    name: columns
    parent: universe
    identifier: universe/columns
weight: 101
flux/v0/tags: [transformations]
introduced: 0.14.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L113-L113

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`columns()` returns the column labels in each input table.

For each input table, `columns` outputs a table with the same group key
columns and a new column containing the column labels in the input table.
Each row in an output table contains the group key value and the label of one
 column of the input table.
Each output table has the same number of rows as the number of columns of the
input table.

##### Function type signature

```js
(<-tables: stream[A], ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Name of the output column to store column labels in.
Default is "_value".



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### List all columns per input table

```js
import "sampledata"

sampledata.string()
    |> columns(column: "labels")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *tag | _value      |
| -------------------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | t1   | smpl_g9qczs |
| 2021-01-01T00:00:10Z | t1   | smpl_0mgv9n |
| 2021-01-01T00:00:20Z | t1   | smpl_phw664 |
| 2021-01-01T00:00:30Z | t1   | smpl_guvzy4 |
| 2021-01-01T00:00:40Z | t1   | smpl_5v3cce |
| 2021-01-01T00:00:50Z | t1   | smpl_s9fmgy |

| _time                | *tag | _value      |
| -------------------- | ---- | ----------- |
| 2021-01-01T00:00:00Z | t2   | smpl_b5eida |
| 2021-01-01T00:00:10Z | t2   | smpl_eu4oxp |
| 2021-01-01T00:00:20Z | t2   | smpl_5g7tz4 |
| 2021-01-01T00:00:30Z | t2   | smpl_sox1ut |
| 2021-01-01T00:00:40Z | t2   | smpl_wfm757 |
| 2021-01-01T00:00:50Z | t2   | smpl_dtn2bv |


#### Output data

| *tag | labels  |
| ---- | ------- |
| t1   | _time   |
| t1   | tag     |
| t1   | _value  |

| *tag | labels  |
| ---- | ------- |
| t2   | _time   |
| t2   | tag     |
| t2   | _value  |

{{% /expand %}}
{{< /expand-wrapper >}}
