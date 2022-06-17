---
title: strings.joinStr() function
description: >
  `strings.joinStr()` concatenates elements of a string array into a single string using a specified separator.
menu:
  flux_0_x_ref:
    name: strings.joinStr
    parent: strings
    identifier: strings/joinStr
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L777-L777

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.joinStr()` concatenates elements of a string array into a single string using a specified separator.



##### Function type signature

```js
strings.joinStr = (arr: [string], v: string) => string
```

## Parameters

### arr
({{< req >}})
Array of strings to concatenate.



### v
({{< req >}})
Separator to use in the concatenated value.




## Examples

### Join a list of strings into a single string

```js
import "strings"

strings.joinStr(arr: ["foo", "bar", "baz", "quz"], v: ", ")// Returns "foo, bar, baz, quz"

```

