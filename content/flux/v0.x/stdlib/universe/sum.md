---
title: sum() function
description: >
  `sum()` returns the sum of non-null values in a specified column.
menu:
  flux_0_x_ref:
    name: sum
    parent: universe
    identifier: universe/sum
weight: 101
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.7.0
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/sum
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/sum/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/sum/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/sum/
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#sum, InfluxQL – SUM()
  - /flux/v0.x/stdlib/experimental/sum/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2546-L2546

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sum()` returns the sum of non-null values in a specified column.



##### Function type signature

```js
(<-tables: stream[A], ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Column to operate on. Default is `_value`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Return the sum of values in each table

```js
import "sampledata"

sampledata.int()
    |> stddev()

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

| *tag | _value            |
| ---- | ----------------- |
| t1   | 7.063993204979744 |

| *tag | _value            |
| ---- | ----------------- |
| t2   | 9.474527252938094 |

{{% /expand %}}
{{< /expand-wrapper >}}
