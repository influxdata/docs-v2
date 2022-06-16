---
title: testing.assertEquals() function
description: >
  `testing.assertEquals()` tests whether two streams of tables are identical.
menu:
  flux_0_x_ref:
    name: testing.assertEquals
    parent: testing
    identifier: testing/assertEquals
weight: 101
flux/v0.x/tags: [tests]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L52-L52

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.assertEquals()` tests whether two streams of tables are identical.

If equal, the function outputs the tested data stream unchanged.
If unequal, the function returns an error.

assertEquals can be used to perform in-line tests in a query.

##### Function type signature

```js
testing.assertEquals = (<-got: stream[A], name: string, want: stream[A]) => stream[A]
```

## Parameters

### name

({{< req >}})
Unique assertion name.

### got


Data to test. Default is piped-forward data (`<-`).

### want

({{< req >}})
Expected data to test against.


## Examples


### Test if streams of tables are different

```js
import "sampledata"
import "testing"

want = sampledata.int()
got = sampledata.float() |> toInt()

testing.assertEquals(name: "test_equality", got: got, want: want)
```


### Test if streams of tables are different mid-script

```js
import "testing"

want =
    from(bucket: "backup-example-bucket")
        |> range(start: -5m)

from(bucket: "example-bucket")
    |> range(start: -5m)
    |> testing.assertEquals(want: want)
```

