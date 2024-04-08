---
title: testing.assertEmpty() function
description: >
  `testing.assertEmpty()` tests if an input stream is empty. If not empty, the function returns an error.
menu:
  flux_v0_ref:
    name: testing.assertEmpty
    parent: testing
    identifier: testing/assertEmpty
weight: 101
flux/v0/tags: [tests]
introduced: 0.18.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L92-L92

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.assertEmpty()` tests if an input stream is empty. If not empty, the function returns an error.

assertEmpty can be used to perform in-line tests in a query.

##### Function type signature

```js
(<-tables: stream[A]) => stream[A]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Check if there is a difference between streams

This example uses `testing.diff()` to output the difference between two streams of tables.
`testing.assertEmpty()` checks to see if the difference is empty.

```js
import "sampledata"
import "testing"

want = sampledata.int()
got = sampledata.float() |> toInt()

got
    |> testing.diff(want: want)
    |> testing.assertEmpty()

```

