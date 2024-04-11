---
title: testing.shouldErrorWithCode() function
description: >
  `testing.shouldErrorWithCode()` calls a function that catches any error and checks that the error matches the expected value.
menu:
  flux_v0_ref:
    name: testing.shouldErrorWithCode
    parent: internal/testing
    identifier: internal/testing/shouldErrorWithCode
weight: 201
flux/v0/tags: [tests]
introduced: 0.182.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/testing/testing.flux#L35-L46

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.shouldErrorWithCode()` calls a function that catches any error and checks that the error matches the expected value.



##### Function type signature

```js
(code: uint, fn: () => A, want: regexp) => stream[{match: bool, code: uint, _diff: string}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### fn
({{< req >}})
Function to call.



### want
({{< req >}})
Regular expression to match the expected error.



### code
({{< req >}})
Which flux error code to expect




## Examples

### Test die function errors

```js
import "testing"

testing.shouldErrorWithCode(fn: () => die(msg: "error message"), want: /error message/, code: 3)

```

