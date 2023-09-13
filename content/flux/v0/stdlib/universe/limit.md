---
title: limit() function
description: >
  `limit()` returns the first `n` rows after the specified `offset` from each input table.
menu:
  flux_v0_ref:
    name: limit
    parent: universe
    identifier: universe/limit
weight: 101
flux/v0.x/tags: [transformations, selectors]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L1674-L1674

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`limit()` returns the first `n` rows after the specified `offset` from each input table.

If an input table has less than `offset + n` rows, `limit()` returns all rows
after the offset.

##### Function type signature

```js
(<-tables: stream[A], n: int, ?offset: int) => stream[A]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### n
({{< req >}})
Maximum number of rows to return.



### offset

Number of rows to skip per table before limiting to `n`.
Default is `0`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Limit results to the first three rows in each table](#limit-results-to-the-first-three-rows-in-each-table)
- [Limit results to the first three rows in each input table after the first two](#limit-results-to-the-first-three-rows-in-each-input-table-after-the-first-two)

### Limit results to the first three rows in each table

```js
import "sampledata"

sampledata.int()
    |> limit(n: 3)

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
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Limit results to the first three rows in each input table after the first two

```js
import "sampledata"

sampledata.int()
    |> limit(n: 3, offset: 2)

```

