---
title: highestCurrent() function
description: >
  `highestCurrent()` selects the last record from each input table and returns the
  highest `n` records.
menu:
  flux_v0_ref:
    name: highestCurrent
    parent: universe
    identifier: universe/highestCurrent
weight: 101
flux/v0/tags: [transformations, selectors]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L4271-L4279

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`highestCurrent()` selects the last record from each input table and returns the
highest `n` records.

**Note:** `highestCurrent()` drops empty tables.

##### Function type signature

```js
(<-tables: stream[A], n: int, ?column: string, ?groupColumns: [string]) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Number of records to return.



### column

Column to evaluate. Default is `_value`.



### groupColumns

List of columns to group by. Default is `[]`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return the highest current value from a stream of tables

```js
import "sampledata"

sampledata.int()
    |> highestCurrent(n: 1, groupColumns: ["tag"])

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

| _time                | _value  | tag  |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:50Z | 4       | t1   |

{{% /expand %}}
{{< /expand-wrapper >}}
