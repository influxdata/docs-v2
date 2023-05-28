---
title: sort() function
description: >
  `sort()` orders rows in each input table based on values in specified columns.
menu:
  flux_0_x_ref:
    name: sort
    parent: universe
    identifier: universe/sort
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2500-L2500

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sort()` orders rows in each intput table based on values in specified columns.

#### Output data
One output table is produced for each input table.
Output tables have the same schema as their corresponding input tables.

#### Sorting with null values
When `desc: false`, null values are last in the sort order.
When `desc: true`, null values are first in the sort order.

##### Function type signature

```js
(<-tables: stream[A], ?columns: [string], ?desc: bool) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### columns

List of columns to sort by. Default is `["_value"]`.

Sort precedence is determined by list order (left to right).

### desc

Sort results in descending order. Default is `false`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Sort values in ascending order

```js
import "sampledata"

sampledata.int()
    |> sort()

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
| 2021-01-01T00:00:50Z | 4       | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
