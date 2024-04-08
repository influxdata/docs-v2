---
title: strings.toTitle() function
description: >
  `strings.toTitle()` converts all characters in a string to title case.
menu:
  flux_v0_ref:
    name: strings.toTitle
    parent: strings
    identifier: strings/toTitle
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/strings/strings.flux#L240-L240

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`strings.toTitle()` converts all characters in a string to title case.

#### toTitle vs toUpper
The results of `toTitle()` and `toUpper()` are often the same, however the
difference is visible when using special characters:

```no_run
str = "ǳ"

strings.toTitle(v: str) // Returns ǲ
strings.toUpper(v: str) // Returns Ǳ
```

##### Function type signature

```js
(v: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to convert.




## Examples

### Convert characters in a string to title case

```js
import "sampledata"
import "strings"

sampledata.string()
    |> map(fn: (r) => ({r with _value: strings.toTitle(v: r._value)}))

```

