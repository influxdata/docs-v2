---
title: testing.assertEqualValues() function
description: >
  `testing.assertEqualValues()` tests whether two values are equal.
menu:
  flux_v0_ref:
    name: testing.assertEqualValues
    parent: testing
    identifier: testing/assertEqualValues
weight: 101
flux/v0/tags: [tests]
introduced: 0.141.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/testing/testing.flux#L218-L220

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`testing.assertEqualValues()` tests whether two values are equal.



##### Function type signature

```js
(got: A, want: A) => stream[{v: A, _diff: string}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### got
({{< req >}})
Value to test.



### want
({{< req >}})
Expected value to test against.




## Examples

### Test if two values are equal

```js
import "testing"

testing.assertEqualValues(got: 5, want: 12)

```

{{< expand-wrapper >}}
{{% expand "View example input" %}}

#### Input data

| _diff  | v  |
| ------ | -- |
| -      | 12 |
| +      | 5  |

{{% /expand %}}
{{< /expand-wrapper >}}
