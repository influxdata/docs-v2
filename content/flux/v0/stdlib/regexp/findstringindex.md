---
title: regexp.findStringIndex() function
description: >
  `regexp.findStringIndex()` returns a two-element array of integers that represent the
  beginning and ending indexes of the first regular expression match in a string.
menu:
  flux_v0_ref:
    name: regexp.findStringIndex
    parent: regexp
    identifier: regexp/findStringIndex
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/regexp/regexp.flux#L93-L93

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`regexp.findStringIndex()` returns a two-element array of integers that represent the
beginning and ending indexes of the first regular expression match in a string.



##### Function type signature

```js
(r: regexp, v: string) => [int]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### r
({{< req >}})
Regular expression used to search `v`.



### v
({{< req >}})
String value to search.




## Examples

### Index the bounds of first regular expression match in each row

```js
import "regexp"

regexp.findStringIndex(r: /ab?/, v: "tablet")// Returns [1, 3]


```

