---
title: sample() function
description: >
  `sample()` selects a subset of the rows from each input table.
menu:
  flux_v0_ref:
    name: sample
    parent: universe
    identifier: universe/sample
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2321-L2323

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sample()` selects a subset of the rows from each input table.

**Note:** `sample()` drops empty tables.

##### Function type signature

```js
(<-tables: stream[A], n: int, ?column: string, ?pos: int) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### n
({{< req >}})
Sample every Nth element.



### pos

Position offset from the start of results where sampling begins.
Default is -1 (random offset).

`pos` must be less than `n`. If pos is less than 0, a random offset is used.

### column

Column to operate on.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Sample every other result

```js
import "sampledata"

sampledata.int()
    |> sample(n: 2, pos: 1)

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

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
