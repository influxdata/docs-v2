---
title: duplicate() function
description: >
  `duplicate()` duplicates a specified column in a table.
menu:
  flux_v0_ref:
    name: duplicate
    parent: universe
    identifier: universe/duplicate
weight: 101
flux/v0/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L494-L497

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`duplicate()` duplicates a specified column in a table.

If the specified column is part of the group key, it will be duplicated, but
the duplicate column will not be part of the output’s group key.

##### Function type signature

```js
(<-tables: stream[A], as: string, column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### column
({{< req >}})
Column to duplicate.



### as
({{< req >}})
Name to assign to the duplicate column.

If the `as` column already exists, it will be overwritten by the duplicated column.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Duplicate a column

```js
import "sampledata"

sampledata.int()
    |> duplicate(column: "tag", as: "tag_dup")

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

| _time                | _value  | *tag | tag_dup  |
| -------------------- | ------- | ---- | -------- |
| 2021-01-01T00:00:00Z | -2      | t1   | t1       |
| 2021-01-01T00:00:10Z | 10      | t1   | t1       |
| 2021-01-01T00:00:20Z | 7       | t1   | t1       |
| 2021-01-01T00:00:30Z | 17      | t1   | t1       |
| 2021-01-01T00:00:40Z | 15      | t1   | t1       |
| 2021-01-01T00:00:50Z | 4       | t1   | t1       |

| _time                | _value  | *tag | tag_dup  |
| -------------------- | ------- | ---- | -------- |
| 2021-01-01T00:00:00Z | 19      | t2   | t2       |
| 2021-01-01T00:00:10Z | 4       | t2   | t2       |
| 2021-01-01T00:00:20Z | -3      | t2   | t2       |
| 2021-01-01T00:00:30Z | 19      | t2   | t2       |
| 2021-01-01T00:00:40Z | 13      | t2   | t2       |
| 2021-01-01T00:00:50Z | 1       | t2   | t2       |

{{% /expand %}}
{{< /expand-wrapper >}}
