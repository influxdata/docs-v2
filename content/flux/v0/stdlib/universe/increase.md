---
title: increase() function
description: >
  `increase()` returns the cumulative sum of non-negative differences between subsequent values.
menu:
  flux_v0_ref:
    name: increase
    parent: universe
    identifier: universe/increase
weight: 101
flux/v0/tags: [transformations]
introduced: 0.71.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3931-L3934

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`increase()` returns the cumulative sum of non-negative differences between subsequent values.

The primary use case for `increase()` is tracking changes in counter values
which may wrap overtime when they hit a threshold or are reset. In the case
of a wrap/reset, `increase()` assumes that the absolute delta between two
points is at least their non-negative difference.

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

### Normalize resets in counter metrics

```js
import "sampledata"

sampledata.int()
    |> increase()

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
| 2021-01-01T00:00:00Z | 0       | t1   |
| 2021-01-01T00:00:10Z | 12      | t1   |
| 2021-01-01T00:00:20Z | 19      | t1   |
| 2021-01-01T00:00:30Z | 29      | t1   |
| 2021-01-01T00:00:40Z | 44      | t1   |
| 2021-01-01T00:00:50Z | 48      | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 0       | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | 4       | t2   |
| 2021-01-01T00:00:30Z | 26      | t2   |
| 2021-01-01T00:00:40Z | 39      | t2   |
| 2021-01-01T00:00:50Z | 40      | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
