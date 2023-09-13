---
title: testing.shouldError() function
description: >
  `testing.shouldError()` calls a function that catches any error and checks that the error matches the expected value.
menu:
  flux_v0_ref:
    name: testing.shouldError
    parent: testing
    identifier: testing/shouldError
weight: 101
flux/v0.x/tags: [tests]
introduced: 0.174.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L242-L252

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.shouldError()` calls a function that catches any error and checks that the error matches the expected value.



##### Function type signature

```js
(fn: () => A, want: regexp) => stream[{v: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### fn
({{< req >}})
Function to call.



### want
({{< req >}})
Regular expression to match the expected error.




## Examples

### Test die function errors

```js
import "testing"

testing.shouldError(fn: () => die(msg: "error message"), want: /error message/)

```

