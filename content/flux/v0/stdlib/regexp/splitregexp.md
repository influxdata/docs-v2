---
title: regexp.splitRegexp() function
description: >
  `regexp.splitRegexp()` splits a string into substrings separated by regular expression
  matches and returns an array of `i` substrings between matches.
menu:
  flux_v0_ref:
    name: regexp.splitRegexp
    parent: regexp
    identifier: regexp/splitRegexp
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/regexp/regexp.flux#L170-L170

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`regexp.splitRegexp()` splits a string into substrings separated by regular expression
matches and returns an array of `i` substrings between matches.



##### Function type signature

```js
(i: int, r: regexp, v: string) => [string]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### r
({{< req >}})
Regular expression used to search `v`.



### v
({{< req >}})
String value to be searched.



### i
({{< req >}})
Maximum number of substrings to return.

-1 returns all matching substrings.


## Examples

### Return an array of regular expression matches

```js
import "regexp"

regexp.splitRegexp(r: /a*/, v: "abaabaccadaaae", i: -1)// Returns ["", "b", "b", "c", "c", "d", "e"]


```

