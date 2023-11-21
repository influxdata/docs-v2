---
title: testing.assertMatches() function
description: >
  `testing.assertMatches()` tests whether a string matches a given regex.
menu:
  flux_v0_ref:
    name: testing.assertMatches
    parent: internal/testing
    identifier: internal/testing/assertMatches
weight: 201
flux/v0/tags: [tests]
introduced: LATEST
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/internal/testing/testing.flux#L67-L73

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.assertMatches()` tests whether a string matches a given regex.



##### Function type signature

```js
(got: string, want: regexp) => stream[{v: string, _diff: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### got
({{< req >}})
Value to test.



### want
({{< req >}})
Regex to test against.




## Examples

### Test if two values are equal

```js
import "internal/testing"

testing.assertMatches(got: "123", want: /12/)

```

