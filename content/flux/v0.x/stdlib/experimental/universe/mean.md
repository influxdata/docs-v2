---
title: mean() function
description: >
  `mean()` returns the average of non-null values in a specified column from each
  input table.
menu:
  flux_0_x_ref:
    name: mean
    parent: experimental/universe
    identifier: experimental/universe/mean
weight: 201
flux/v0.x/tags: [transformations, aggregates]
introduced: v0.166.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/universe/universe.flux#L118-L122

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`mean()` returns the average of non-null values in a specified column from each
input table.

**Note:** `universe.mean()` is an experimental function with a more precise type signature.

##### Function type signature

```js
mean = (<-tables: stream[{B with A: C}], ?column: A = "_value") => stream[{A: C}] where A: Label, B: Record, C: Numeric
```

## Parameters

### column

Column to use to compute means. Default is `_value`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return the average of values in each input table

```js
import "experimental/universe"
import "sampledata"

sampledata.int()
    |> universe.mean()
```

{{< expand-wrapper >}}
{{% expand "View example input and ouput" %}}

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

| *tag | _value  |
| ---- | ------- |
| t1   | 8.5     |

| *tag | _value            |
| ---- | ----------------- |
| t2   | 8.833333333333334 |

{{% /expand %}}
{{< /expand-wrapper >}}
