---
title: cumulativeSum() function
description: >
  `cumulativeSum()`  computes a running sum for non-null records in a table.
menu:
  flux_v0_ref:
    name: cumulativeSum
    parent: universe
    identifier: universe/cumulativeSum
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

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L224-L227

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`cumulativeSum()`  computes a running sum for non-null records in a table.

The output table schema will be the same as the input table.

##### Function type signature

```js
(<-tables: stream[A], ?columns: [string]) => stream[B] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### columns

List of columns to operate on. Default is `["_value"]`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return the running total of values in each table

```js
import "sampledata"

sampledata.int()
    |> cumulativeSum()

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
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 8       | t1   |
| 2021-01-01T00:00:20Z | 15      | t1   |
| 2021-01-01T00:00:30Z | 32      | t1   |
| 2021-01-01T00:00:40Z | 47      | t1   |
| 2021-01-01T00:00:50Z | 51      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 23      | t2   |
| 2021-01-01T00:00:20Z | 20      | t2   |
| 2021-01-01T00:00:30Z | 39      | t2   |
| 2021-01-01T00:00:40Z | 52      | t2   |
| 2021-01-01T00:00:50Z | 53      | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
