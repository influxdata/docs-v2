---
title: strings.splitAfterN() function
description: >
  `strings.splitAfterN()` splits a string after a specified separator and returns an array of `i` substrings.
  Split substrings include the separator, `t`.
menu:
  flux_v0_ref:
    name: strings.splitAfterN
    parent: strings
    identifier: strings/splitAfterN
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L758-L758

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.splitAfterN()` splits a string after a specified separator and returns an array of `i` substrings.
Split substrings include the separator, `t`.



##### Function type signature

```js
(i: int, t: string, v: string) => [string]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to split.



### t
({{< req >}})
String value that acts as the separator.



### i
({{< req >}})
Maximum number of split substrings to return.

`-1` returns all matching substrings.
The last substring is the unsplit remainder.


## Examples

### Split a string into an array of substrings

```js
import "strings"

strings.splitAfterN(v: "foo, bar, baz, quz", t: ", ", i: 3)// Returns ["foo, ", "bar, ", "baz, quz"]


```

