---
title: pearsonr() function
description: >
  `pearsonr()` returns the covariance of two streams of tables normalized to the
  Pearson R coefficient.
menu:
  flux_v0_ref:
    name: pearsonr
    parent: universe
    identifier: universe/pearsonr
weight: 101
flux/v0.x/tags: [transformations, aggregates]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L3734-L3734

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pearsonr()` returns the covariance of two streams of tables normalized to the
Pearson R coefficient.



##### Function type signature

```js
(on: [string], x: A, y: B) => stream[C] where C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

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

pearsonr(x: stream1, y: stream2, on: ["_time"])

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| _value             |
| ------------------ |
| 0.9856626734271221 |

{{% /expand %}}
{{< /expand-wrapper >}}
