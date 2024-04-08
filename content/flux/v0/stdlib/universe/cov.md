---
title: cov() function
description: >
  `cov()` computes the covariance between two streams of tables.
menu:
  flux_v0_ref:
    name: cov
    parent: universe
    identifier: universe/cov
weight: 101
flux/v0/tags: [transformations, aggregates]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3703-L3705

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`cov()` computes the covariance between two streams of tables.



##### Function type signature

```js
(on: [string], x: A, y: B, ?pearsonr: bool) => stream[C] where C: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### x
({{< req >}})
First input stream.



### y
({{< req >}})
Second input stream.



### on
({{< req >}})
List of columns to join on.



### pearsonr

Normalize results to the Pearson R coefficient. Default is `false`.




## Examples

### Return the covariance between two streams of tables

```js
import "generate"

stream1 =
    generate.from(
        count: 5,
        fn: (n) => n * n,
        start: 2021-01-01T00:00:00Z,
        stop: 2021-01-01T00:01:00Z,
    )
        |> toFloat()

stream2 =
    generate.from(
        count: 5,
        fn: (n) => n * n * n / 2,
        start: 2021-01-01T00:00:00Z,
        stop: 2021-01-01T00:01:00Z,
    )
        |> toFloat()

cov(x: stream1, y: stream2, on: ["_time"])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _value  |
| ------- |
| 87.75   |

{{% /expand %}}
{{< /expand-wrapper >}}
