---
title: regexp.compile() function
description: >
  `regexp.compile()` parses a string into a regular expression and returns a regexp type
  that can be used to match against strings.
menu:
  flux_v0_ref:
    name: regexp.compile
    parent: regexp
    identifier: regexp/compile
weight: 101
flux/v0/tags: [type-conversions]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/regexp/regexp.flux#L28-L28

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`regexp.compile()` parses a string into a regular expression and returns a regexp type
that can be used to match against strings.



##### Function type signature

```js
(v: string) => regexp
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### v
({{< req >}})
String value to parse into a regular expression.




## Examples

### Convert a string into a regular expression

```js
import "regexp"

regexp.compile(v: "abcd")// Returns the regexp object /abcd/


```

